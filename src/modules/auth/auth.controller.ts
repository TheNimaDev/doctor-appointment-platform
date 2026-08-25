import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  ConfirmChangeEmailDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendVerificationEmailDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto';
import type { AccessRequest, ApiResponse, LoginResponse, NormalizedClientInfo, RefreshRequest } from '@/types';
import type { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { NormalizeClientInfo } from '@/common';
import * as AuthDecorator from './decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Build secure cookie options for the refresh token.
   * - Enables strict security settings in production.
   */
  getCookieOptions(maxAge?: number): CookieOptions {
    const isProduction: boolean = this.configService.get<string>('NODE_ENV') === 'production';

    return {
      sameSite: isProduction ? 'strict' : 'lax',
      httpOnly: true,
      secure: isProduction,
      path: '/',
      maxAge,
    };
  }

  /**
   * Register a new user account.
   * - Sends an email verification request after successful registration.
   */
  @Post('register')
  @AuthDecorator.RegisterDecorators()
  async register(@Body() registerDto: RegisterDto): Promise<ApiResponse> {
    await this.authService.register(registerDto);

    return {
      message: 'Registration successful. Please verify your email.',
    };
  }

  /**
   * Verify a user's email address using the provided verification token.
   */
  @Get('verify/email')
  @AuthDecorator.VerifyEmailDecorators()
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<ApiResponse> {
    await this.authService.verifyEmail(verifyEmailDto);

    return {
      message: 'Email verified successfully.',
    };
  }

  /**
   * Authenticate a user and issue access and refresh tokens.
   * - Stores the refresh token in an HTTP-only cookie.
   */
  @Post('login')
  @AuthDecorator.LoginDecorators()
  async login(
    @Body() loginDto: LoginDto,
    @NormalizeClientInfo() clientInfo: NormalizedClientInfo,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<LoginResponse>> {
    const { refreshToken, ...data } = await this.authService.login({ ...loginDto, clientInfo });

    res.cookie('refreshToken', refreshToken.token, this.getCookieOptions(refreshToken.maxAge));

    return {
      message: 'Login successful.',
      data,
    };
  }

  /**
   * Log out the current session and revoke its refresh token.
   */
  @Post('logout')
  @AuthDecorator.LogoutDecorators()
  async logout(@Req() req: RefreshRequest, @Res({ passthrough: true }) res: Response): Promise<ApiResponse> {
    res.clearCookie('refreshToken', this.getCookieOptions());
    await this.authService.logout(req.refreshPayload);

    return {
      message: 'Logout successfully.',
    };
  }

  /**
   * Log out the user from all active sessions and revoke all refresh tokens.
   */
  @Post('logout/all')
  @AuthDecorator.LogoutAllDecorators()
  async logoutAll(@Req() req: RefreshRequest, @Res({ passthrough: true }) res: Response): Promise<ApiResponse> {
    res.clearCookie('refreshToken', this.getCookieOptions());
    await this.authService.logoutAll(req.refreshPayload);

    return {
      message: 'Logout from all devices successfully.',
    };
  }

  /**
   * Resend the email verification link for a pending user.
   */
  @Post('verify/email/resend')
  @AuthDecorator.VerifyEmailResendDecorators()
  async resendVerificationEmail(@Body() resendVerificationEmailDto: ResendVerificationEmailDto): Promise<ApiResponse> {
    await this.authService.resendVerificationEmail(resendVerificationEmailDto);

    return {
      message: 'Verification email sent successfully.',
    };
  }

  /**
   * Refresh the user's access and refresh tokens.
   * - Validates the current refresh token using the refresh token guard.
   * - Rotates the refresh token and stores the new token in an HTTP-only cookie.
   * - Returns a new access token and user data.
   */
  @Post('refresh')
  @AuthDecorator.RefreshDecorators()
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<LoginResponse>> {
    const { refreshToken, ...data } = await this.authService.refresh(req.refreshPayload);

    res.cookie('refreshToken', refreshToken.token, this.getCookieOptions(refreshToken.maxAge));

    return {
      message: 'Token refreshed successfully.',
      data,
    };
  }

  /**
   * Change the authenticated user's password.
   * - Requires a valid access token.
   * - Validates the current password before updating it.
   * - Revokes active sessions after a successful password change.
   */
  @Post('password/change')
  @AuthDecorator.ChangePasswordDecorators()
  async changePassword(@Req() req: AccessRequest, @Body() changePasswordDto: ChangePasswordDto): Promise<ApiResponse> {
    await this.authService.changePassword({
      userId: req.user.userId,
      ...changePasswordDto,
    });

    return {
      message: 'Password changed successfully.',
    };
  }

  /**
   * Request a password reset email.
   * - Generates a password reset token.
   * - Sends the reset link to the user's email.
   */
  @Post('password/forgot')
  @AuthDecorator.ForgotPasswordDecorators()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ApiResponse> {
    await this.authService.forgotPassword(forgotPasswordDto);

    return {
      message: 'If the email exists, a password reset link has been sent.',
    };
  }

  /**
   * Reset a user's password using a valid password reset token.
   *
   * - Validates the reset token.
   * - Updates the user's password.
   * - Revokes all active sessions.
   */
  @Post('password/reset')
  @AuthDecorator.ResetPasswordDecorators()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ApiResponse> {
    await this.authService.resetPassword(resetPasswordDto);

    return {
      message: 'Password reset successfully.',
    };
  }

  /**
   * Request an email address change.
   *
   * - Requires the current password.
   * - Sends a verification link to the current email address.
   */
  @Post('email/change')
  @AuthDecorator.ChangeEmailDecorators()
  async changeEmail(@Req() req: AccessRequest, @Body() changeEmailDto: ChangeEmailDto): Promise<ApiResponse> {
    await this.authService.changeEmail({
      userId: req.user.userId,
      password: changeEmailDto.password,
    });

    return {
      message: 'A verification email has been sent to your current email address.',
    };
  }

  /**
   * Confirm an email address change.
   *
   * - Validates the email change verification token.
   * - Updates the user's email address.
   * - Revokes all active sessions.
   */
  @Post('email/change/confirm')
  @AuthDecorator.ConfirmChangeEmailDecorators()
  async confirmChangeEmail(@Body() confirmChangeEmailDto: ConfirmChangeEmailDto): Promise<ApiResponse> {
    await this.authService.confirmChangeEmail(confirmChangeEmailDto);

    return {
      message: 'Email address changed successfully.',
    };
  }
}
