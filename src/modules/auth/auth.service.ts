import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { User } from '@/modules/user/entities';
import ms, { StringValue } from 'ms';
import {
  AccessTokenPayload,
  BaseException,
  ChangePasswordParams,
  LoginParams,
  LoginServiceOutput,
  RefreshTokenPayload,
  RegisterParams,
  ResendVerificationEmailPayload,
  VerifyEmailParams,
} from '@/types';
import { compareSecret, getSafeUser, hashSecret } from '@/lib';
import { EmailService } from '../email/email.service';
import { EVENTS } from '@/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserStatus } from '@/modules/user/enums';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import { SessionService } from '../session/session.service';
import { Session } from '../session/entities';
import { UserService } from '../user/user.service';
import { EmailType } from '../email/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user and create an email verification token.
   * - Creates the user and verification token within a transaction.
   * - Emits a signup verification event after the transaction succeeds.
   */
  async register(params: RegisterParams): Promise<void> {
    const result = await this.databaseService.dataSource.transaction(async (manager) => {
      const hashedPassword = await hashSecret(params.password);

      const { user } = await this.userService.createUser({
        ...params,
        manager,
        password: hashedPassword,
      });

      const token = await this.emailService.createEmail({
        userId: user.id,
        manager,
        type: EmailType.EMAIL_VERIFICATION,
      });
      console.log(token); // TODO: Remove before production

      return {
        user,
        token,
      };
    });

    try {
      this.eventEmitter.emit(EVENTS.SIGNUP_VERIFICATION, {
        email: result.user.email,
        token: result.token,
      });
    } catch (_) {}
  }

  /**
   * Verify a user's email and activate their account.
   * - Verifies the email token and activates the user within a transaction.
   */
  async verifyEmail(params: VerifyEmailParams): Promise<void> {
    await this.databaseService.dataSource.transaction(async (manager) => {
      const userId = await this.emailService.validateEmailToken({
        ...params,
        manager,
        type: EmailType.EMAIL_VERIFICATION,
        token: params.token,
      });

      await this.userService.updateUserStatus({
        manager,
        userId,
        status: UserStatus.ACTIVE,
      });
    });
  }

  /**
   * Authenticate a user and issue access and refresh tokens.
   * - Validates the user's credentials and account status.
   * - Creates or updates the user's active session.
   * - Creates a new refresh token within a transaction.
   */
  async login(params: LoginParams): Promise<LoginServiceOutput> {
    const user = await this.userService.findByEmailWithPassword(params.email);

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

    const refreshTokenData = await this.databaseService.dataSource.transaction(async (manager) => {
      let userSession: Session;
      const remember = params.remember ?? false;

      const existingSession = await this.sessionService.findActiveUserSession({
        userId: userData.id,
        clientInfo: params.clientInfo,
        manager,
      });

      if (existingSession) {
        await this.sessionService.updateSession({
          sessionId: existingSession.id,
          remember,
          manager,
        });

        userSession = existingSession;
      } else {
        userSession = await this.sessionService.createSession({
          userId: userData.id,
          clientInfo: params.clientInfo,
          manager,
          remember,
        });
      }

      return this.refreshTokenService.createRefreshToken({
        sessionId: userSession.id,
        clientInfo: params.clientInfo,
        remember,
        manager,
      });
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
      refreshToken: refreshTokenData,
    };
  }

  /**
   * Log out the current session.
   * - Revokes the current refresh token and its associated session atomically.
   */
  async logout(params: RefreshTokenPayload): Promise<void> {
    await this.databaseService.dataSource.transaction(async (manager) => {
      await this.refreshTokenService.revokeRefreshTokenByHash({
        tokenHash: params.refreshRecord.tokenHash,
        manager,
      });

      await this.sessionService.revokeSession({
        sessionId: params.session.id,
        manager,
      });
    });
  }

  /**
   * Log out the user from all active sessions.
   * - Revokes all user refresh tokens and active sessions atomically.
   */
  async logoutAll(params: RefreshTokenPayload): Promise<void> {
    await this.databaseService.dataSource.transaction(async (manager) => {
      await this.refreshTokenService.revokeUserRefreshTokens({
        userId: params.user.id,
        manager,
      });

      await this.sessionService.revokeUserSessions({
        userId: params.user.id,
        manager,
      });
    });
  }

  /**
   * Resend the email verification token for a pending user.
   * - Validates the user's email and password.
   * - Enforces the email verification resend cooldown.
   * - Creates a new verification token within a transaction.
   * - Emits a signup verification event after the transaction succeeds.
   */
  async resendVerificationEmail(params: ResendVerificationEmailPayload): Promise<void> {
    const user = await this.databaseService.dataSource
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.email = :email', { email: params.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid user credentials',
        error: 'Invalid Credentials',
      } as BaseException);
    }

    const isValidPassword = await compareSecret(params.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException({
        message: 'Invalid user credentials',
        error: 'Invalid Credentials',
      } as BaseException);
    }

    if (user.status !== UserStatus.PENDING_VERIFICATION) {
      throw new BadRequestException({
        message: 'Email verification is not required for this account',
        error: 'Email Verification Not Required',
      } as BaseException);
    }

    const result = await this.databaseService.dataSource.transaction(async (manager) => {
      const existingEmail = await this.emailService.findActiveEmail({
        userId: user.id,
        manager,
        type: EmailType.EMAIL_VERIFICATION,
      });

      if (existingEmail) {
        const cooldown = this.configService.getOrThrow<StringValue>('EMAIL_COOLDOWN');

        const nextAllowedAt = existingEmail.createdAt.getTime() + ms(cooldown);

        if (Date.now() < nextAllowedAt) {
          throw new BadRequestException({
            message: 'Please wait before requesting another verification email',
            error: 'Resend Cooldown',
          } as BaseException);
        }
      }

      const token = await this.emailService.createEmail({
        userId: user.id,
        manager,
        type: EmailType.EMAIL_VERIFICATION,
      });

      return {
        email: user.email,
        token,
      };
    });

    try {
      this.eventEmitter.emit(EVENTS.SIGNUP_VERIFICATION, result);
    } catch (_) {}
  }

  /**
   * Rotate the current refresh token and issue a new access token.
   * - Revokes the current refresh token.
   * - Updates the session's last active time.
   * - Creates a new refresh token for the same session.
   * - Preserves the session's remember preference.
   */
  async refresh(params: RefreshTokenPayload): Promise<LoginServiceOutput> {
    const refreshTokenData = await this.databaseService.dataSource.transaction(async (manager) => {
      await this.refreshTokenService.revokeRefreshTokenByHash({
        tokenHash: params.refreshRecord.tokenHash,
        manager,
      });

      await this.sessionService.updateSession({
        sessionId: params.session.id,
        manager,
      });

      return this.refreshTokenService.createRefreshToken({
        sessionId: params.session.id,
        clientInfo: {
          ipAddress: params.session.ipAddress,
          userAgent: params.session.userAgent,
          browser: params.session.browser,
          os: params.session.os,
          device: params.session.device,
          country: params.session.country,
          city: params.session.city,
        },
        remember: params.session.remember,
        manager,
      });
    });

    const accessTokenPayload: AccessTokenPayload = {
      sub: params.user.id,
      display_name: `${params.user.firstName ?? ''} ${params.user.lastName ?? ''}`.trim(),
      roles: params.user.roles,
      permissions: params.user.permissions,
    };

    const accessToken = this.generateAccessToken(accessTokenPayload);

    return {
      user: params.user,
      accessToken,
      refreshToken: refreshTokenData,
    };
  }

  /**
   * Change the authenticated user's password.
   *
   * - Validates the current password.
   * - Ensures the new password is different.
   * - Updates the user's password hash.
   * - Revokes all active sessions and refresh tokens.
   */
  async changePassword(params: ChangePasswordParams): Promise<void> {
    const user = await this.userService.findByIdWithPassword(params.userId);

    const isValidPassword = await compareSecret(params.currentPassword, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException({
        message: 'Invalid current password',
        error: 'Invalid Credentials',
      } as BaseException);
    }

    const isSamePassword = await compareSecret(params.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException({
        message: 'New password must be different from the current password',
        error: 'Same Password',
      } as BaseException);
    }

    await this.databaseService.dataSource.transaction(async (manager) => {
      const passwordHash = await hashSecret(params.newPassword);

      await this.userService.updatePassword({
        userId: params.userId,
        password: passwordHash,
        manager,
      });

      await this.sessionService.revokeUserSessions({
        userId: params.userId,
        manager,
      });
      await this.refreshTokenService.revokeUserRefreshTokens({
        userId: params.userId,
        manager,
      });
    });
  }

  /**
   * Generate a new access token from the given payload.
   */
  generateAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_TOKEN_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_EXPIRES'),
    });
  }
}
