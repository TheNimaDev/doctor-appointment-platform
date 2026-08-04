import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '@/modules/mail/mail.service';
import { EVENTS } from '@/common';
import type { SignupVerificationEvent } from '@/types';

@Injectable()
export class EmailListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(EVENTS.SIGNUP_VERIFICATION)
  async handleSignupVerification(payload: SignupVerificationEvent): Promise<void> {
    const verifyUrl = `http://localhost:3000/api/v1/auth/verify/email?token=${payload.token}`;

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
  }
}
