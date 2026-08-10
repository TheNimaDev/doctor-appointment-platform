import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '@/modules/mail/mail.service';
import { EVENTS } from '@/common';
import type { PasswordResetEvent, SignupVerificationEvent } from '@/types';
import { EmailService } from '../email.service';
import { EmailStatus } from '../enums';

@Injectable()
export class EmailListener {
  constructor(
    private readonly mailService: MailService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Handle signup verification events and send the verification email.
   */
  @OnEvent(EVENTS.SIGNUP_VERIFICATION)
  async handleSignupVerification(payload: SignupVerificationEvent): Promise<void> {
    const verifyUrl = `http://localhost:3000/api/v1/auth/verify/email?token=${payload.token}`;

    try {
      await this.mailService.send({
        to: payload.email,
        subject: 'Verify your email',
        html: `
          <h2>Welcome to Doctor Platform</h2>

          <p>Please verify your email using the link below:</p>

          <a href="${verifyUrl}">
            Verify Email
          </a>

          <p>This link expires in 10 minutes.</p>
        `,
      });

      await this.emailService.updateEmailStatus({
        emailId: payload.emailId,
        status: EmailStatus.SENT,
      });
    } catch (error) {
      await this.emailService.updateEmailStatus({
        emailId: payload.emailId,
        status: EmailStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown email error',
      });
    }
  }

  /**
   * Handle password reset events and send the password reset email.
   */
  @OnEvent(EVENTS.PASSWORD_RESET)
  async handlePasswordReset(payload: PasswordResetEvent): Promise<void> {
    const resetUrl = `http://localhost:3000/api/v1/auth/password/reset?token=${payload.token}`;

    try {
      await this.mailService.send({
        to: payload.email,
        subject: 'Reset your password',
        html: `
          <h2>Password Reset</h2>

          <p>You requested to reset your password.</p>

          <p>Please use the link below to reset your password:</p>

          <a href="${resetUrl}">
            Reset Password
          </a>

          <p>This link expires in 10 minutes.</p>
        `,
      });

      await this.emailService.updateEmailStatus({
        emailId: payload.emailId,
        status: EmailStatus.SENT,
      });
    } catch (error) {
      await this.emailService.updateEmailStatus({
        emailId: payload.emailId,
        status: EmailStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Unknown email error',
      });
    }
  }
}
