import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailParams } from '@/types';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(params: SendMailParams): Promise<void> {
    await this.mailerService.sendMail({
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  }
}
