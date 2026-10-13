import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { User } from '@/modules/user/entities';
import ms, { StringValue } from 'ms';
import {
  AccessTokenPayload,
  BaseException,
  ChangeEmailParams,
  ChangePasswordParams,
  ConfirmChangeEmailParams,
  ForgotPasswordParams,
  LoginParams,
  LoginServiceOutput,
  RefreshTokenPayload,
  RegisterParams,
  ResendVerificationEmailPayload,
  ResetPasswordParams,
  VerifyEmailParams,
} from '@/types';
import { compareSecret } from '@/lib';
import { EmailService } from '@/modules/email/email.service';
import { EVENTS, ROLES } from '@/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserStatus } from '@/modules/user/enums';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@/modules/refresh-token/refresh-token.service';
import { SessionService } from '@/modules/session/session.service';
import { UserService } from '@/modules/user/user.service';
import { EmailType } from '@/modules/email/enums';
import { UserRoleService } from '@/modules/user-role/user-role.service';
import { RoleService } from '@/modules/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user and create an email verification token.
   */
  async register(params: RegisterParams): Promise<void> {
    const result = await this.databaseService.dataSource.transaction(async (manager) => {
      const { user } = await this.userService.createUser({
        ...params,
        manager,
      });

      const { role } = await this.roleService.findByName({
        name: ROLES.PATIENT,
        manager,
      });

      await this.userRoleService.add({
        roleId: role.id,
        userId: user.id,
        manager,
      });

      const token = await this.emailService.createEmail({
        userId: user.id,
        manager,
        type: EmailType.EMAIL_VERIFICATION,
      });

      return {
        user,
        token,
      };
    });

    try {
      this.eventEmitter.emit(EVENTS.SIGNUP_VERIFICATION, {
        email: result.user.email,
        emailId: result.token.emailId,
        token: result.token.token,
      });
    } catch (_) {}
  }

  /**
   * Verify a user's email and activate their account.
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
   */
  async login(params: LoginParams): Promise<LoginServiceOutput> {
    const { user } = await this.userService.findByEmailWithPassword(params.email);

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

    const userResponse = await this.userService.getById({
      id: user.id,
    });

    const userData = userResponse.user;

    return await this.databaseService.dataSource.transaction(async (manager) => {
      let userSession;
      const remember = params.remember ?? false;

      const existingSession = await this.sessionService.findActiveUserSession({
        userId: userData.id,
        clientInfo: params.clientInfo,
        manager,
      });

      if (existingSession) {
        await this.sessionService.updateSession({
          sessionId: existingSession.session.id,
          remember,
          manager,
        });

        userSession = existingSession.session;
      } else {
        const newSession = await this.sessionService.createSession({
          userId: userData.id,
          clientInfo: params.clientInfo,
          manager,
          remember,
        });

        userSession = newSession.session;
      }

      const refreshToken = await this.refreshTokenService.createRefreshToken({
        sessionId: userSession.id,
        clientInfo: params.clientInfo,
        remember,
        manager,
      });

      const accessTokenPayload: AccessTokenPayload = {
        sub: user.id,
        sessionId: userSession.id,
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
    });
  }

  /**
   * Log out the current session.
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
   */
  async resendVerificationEmail(params: ResendVerificationEmailPayload): Promise<void> {
    const user = await this.databaseService.dataSource
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.email = :email', { email: params.email })
      .getOne();

    if (!user) {
      return;
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

        const nextAllowedAt = existingEmail.email.createdAt.getTime() + ms(cooldown);

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
        token: token.token,
        emailId: token.emailId,
      };
    });

    try {
      this.eventEmitter.emit(EVENTS.SIGNUP_VERIFICATION, result);
    } catch (_) {}
  }

  /**
   * Rotate the current refresh token and issue a new access token.
   */
  async refresh(params: RefreshTokenPayload): Promise<LoginServiceOutput> {
    return await this.databaseService.dataSource.transaction(async (manager) => {
      await this.refreshTokenService.revokeRefreshTokenByHash({
        tokenHash: params.refreshRecord.tokenHash,
        manager,
      });

      await this.sessionService.updateSession({
        sessionId: params.session.id,
        manager,
      });

      const refreshToken = await this.refreshTokenService.createRefreshToken({
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

      const accessTokenPayload: AccessTokenPayload = {
        sub: params.user.id,
        sessionId: params.session.id,
        display_name: `${params.user.firstName ?? ''} ${params.user.lastName ?? ''}`.trim(),
        roles: params.user.roles,
        permissions: params.user.permissions,
      };

      const accessToken = this.generateAccessToken(accessTokenPayload);

      return {
        user: params.user,
        accessToken,
        refreshToken,
      };
    });
  }

  /**
   * Change the authenticated user's password.
   */
  async changePassword(params: ChangePasswordParams): Promise<void> {
    const { user } = await this.userService.findByIdWithPassword(params.userId);

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
      await this.userService.updatePassword({
        userId: params.userId,
        password: params.newPassword,
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
   * Request a password reset email.
   */
  async forgotPassword(params: ForgotPasswordParams): Promise<void> {
    const user = await this.userService.findByEmail({
      email: params.email,
    });

    if (!user) {
      return;
    }

    const result = await this.databaseService.dataSource.transaction(async (manager) => {
      const existingEmail = await this.emailService.findActiveEmail({
        userId: user.user.id,
        type: EmailType.PASSWORD_RESET,
        manager,
      });

      if (existingEmail) {
        const cooldown = this.configService.getOrThrow<StringValue>('EMAIL_COOLDOWN');

        const nextAllowedAt = existingEmail.email.createdAt.getTime() + ms(cooldown);

        if (Date.now() < nextAllowedAt) {
          throw new BadRequestException({
            message: 'Please wait before requesting another password reset email',
            error: 'Resend Cooldown',
          } as BaseException);
        }
      }

      const token = await this.emailService.createEmail({
        userId: user.user.id,
        type: EmailType.PASSWORD_RESET,
        manager,
      });

      return token;
    });

    try {
      this.eventEmitter.emit(EVENTS.PASSWORD_RESET, {
        email: user.user.email,
        token: result.token,
        emailId: result.emailId,
      });
    } catch (_) {}
  }

  /**
   * Reset a user's password using a valid password reset token.
   */
  async resetPassword(params: ResetPasswordParams): Promise<void> {
    await this.databaseService.dataSource.transaction(async (manager) => {
      const userId = await this.emailService.validateEmailToken({
        token: params.token,
        manager,
        type: EmailType.PASSWORD_RESET,
      });

      await this.userService.updatePassword({
        userId,
        password: params.newPassword,
        manager,
      });

      await this.sessionService.revokeUserSessions({
        userId,
        manager,
      });

      await this.refreshTokenService.revokeUserRefreshTokens({
        userId,
        manager,
      });
    });
  }

  /**
   * Request an email address change.
   */
  async changeEmail(params: ChangeEmailParams): Promise<void> {
    const { user } = await this.userService.findByIdWithPassword(params.userId);

    const isPasswordValid = await compareSecret(params.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Current password is incorrect.',
        error: 'Invalid Current Password',
      } as BaseException);
    }

    const token = await this.emailService.createEmail({
      userId: params.userId,
      type: EmailType.EMAIL_CHANGE_VERIFICATION,
    });

    try {
      this.eventEmitter.emit(EVENTS.EMAIL_CHANGE_VERIFICATION, {
        email: user.email,
        token: token.token,
        emailId: token.emailId,
      });
    } catch (_) {}
  }

  /**
   * Confirm an email address change.
   */
  async confirmChangeEmail(params: ConfirmChangeEmailParams): Promise<void> {
    await this.databaseService.dataSource.transaction(async (manager) => {
      const userId = await this.emailService.validateEmailToken({
        token: params.token,
        manager,
        type: EmailType.EMAIL_CHANGE_VERIFICATION,
      });

      const existingUser = await this.userService.findByEmail({
        email: params.newEmail,
        manager,
      });

      if (existingUser) {
        if (existingUser.user.id !== userId) {
          throw new ConflictException({
            message: 'Email address is already in use.',
            error: 'Email Already Exists',
          } as BaseException);
        } else {
          throw new BadRequestException({
            message: 'New email must be different from the current email',
            error: 'Same Email',
          } as BaseException);
        }
      }

      await this.userService.updateEmail({
        userId,
        email: params.newEmail,
        manager,
      });

      await this.sessionService.revokeUserSessions({
        userId,
        manager,
      });

      await this.refreshTokenService.revokeUserRefreshTokens({
        userId,
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
