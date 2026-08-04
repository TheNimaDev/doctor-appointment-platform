import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { User } from '@/modules/user/entities';
import type { StringValue } from 'ms';
import {
  AccessTokenPayload,
  BaseException,
  LoginParams,
  LoginResponse,
  RegisterParams,
  VerifyEmailParams,
} from '@/types';
import { checkDatabaseError, compareSecret, generateRandomToken, getSafeUser, hashSecret, hashToken } from '@/lib';
import { EmailService } from '../email/email.service';
import { EVENTS } from '@/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserStatus } from '@/modules/user/enums';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
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

  async login(params: LoginParams): Promise<LoginResponse & { refreshToken: string }> {
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

    const refreshToken: string = generateRandomToken();
    const hashedRefreshToken: string = hashToken(refreshToken);

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

  /** generate new accessToken with payload */
  generateAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_TOKEN_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_EXPIRES'),
    });
  }
}
