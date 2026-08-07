import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { User } from '@/modules/user/entities';
import type { StringValue } from 'ms';
import {
  AccessTokenPayload,
  BaseException,
  CreateRefreshTokenOutput,
  LoginParams,
  LoginServiceOutput,
  RefreshTokenPayload,
  RegisterParams,
  VerifyEmailParams,
} from '@/types';
import { checkDatabaseError, compareSecret, getSafeUser, hashSecret } from '@/lib';
import { EmailService } from '../email/email.service';
import { EVENTS } from '@/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserStatus } from '@/modules/user/enums';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import { SessionService } from '../session/session.service';
import { Session } from '../session/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(params: RegisterParams): Promise<void> {
    const safeUser = await this.databaseService.dataSource.transaction(async (manager) => {
      const hashedPassword = await hashSecret(params.password);

      try {
        const user = manager.create(User, {
          ...params,
          password: hashedPassword,
        });

        await manager.save(user);

        return getSafeUser(user).user;
      } catch (error) {
        checkDatabaseError({
          e: error as Error,
          mainResource: 'User',
          conflictField: 'email',
        });
      }
    });

    const token = await this.emailService.create({ userId: safeUser.id });
    console.log(token); // TODO: Remove before production

    try {
      this.eventEmitter.emit(EVENTS.SIGNUP_VERIFICATION, {
        email: safeUser.email,
        token,
      });
    } catch (_) {}
  }

  async verifyEmail(params: VerifyEmailParams): Promise<void> {
    const userId = await this.emailService.verify(params);
    await this.databaseService.dataSource.manager.update(User, userId, {
      status: UserStatus.ACTIVE,
    });
  }

  async login(params: LoginParams): Promise<LoginServiceOutput> {
    const user = await this.databaseService.dataSource
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.email = :email', { email: params.email })
      .getOne();

    if (!user)
      throw new UnauthorizedException({
        message: 'Invalid user credentials',
        error: 'Invalid Credentials',
      } as BaseException);

    const isValidPassword: boolean = await compareSecret(params.password, user.password);

    if (!isValidPassword)
      throw new UnauthorizedException({
        message: 'Invalid user credentials',
        error: 'Invalid Credentials',
      } as BaseException);

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException({
        message: 'User account is not active',
        error: 'Account Not Active',
      } as BaseException);
    }

    const { user: userData } = getSafeUser(user);

    const isSessionExists = await this.sessionService.findActiveUserSession({
      userId: userData.id,
      clientInfo: params.clientInfo,
    });

    let userSession: Session;
    if (isSessionExists) {
      await this.sessionService.updateLastActive(isSessionExists.id);
      userSession = isSessionExists;
    } else {
      userSession = await this.sessionService.createSession({
        userId: userData.id,
        clientInfo: params.clientInfo,
      });
    }

    const refreshToken: CreateRefreshTokenOutput = await this.refreshTokenService.createRefreshToken({
      sessionId: userSession.id,
      clientInfo: params.clientInfo,
      remember: params.remember,
    });

    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      display_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      roles: userData.roles,
      permissions: userData.permissions,
    };
    const accessToken: string = this.generateAccessToken(accessTokenPayload);

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  async logout(params: RefreshTokenPayload): Promise<void> {
    await this.refreshTokenService.revokeRefreshTokenByHash(params.refreshRecord.tokenHash);
    await this.sessionService.revokeSession(params.session.id);
  }

  async logoutAll(params: RefreshTokenPayload): Promise<void> {
    await this.refreshTokenService.revokeAllUserRefreshTokens(params.user.id);
    await this.sessionService.revokeUserSessions(params.user.id);
  }

  /** generate new accessToken with payload */
  generateAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_TOKEN_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_EXPIRES'),
    });
  }
}
