import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './entities';
import { EmailListener } from './listeners/email.listener';
import { MailModule } from '@/modules/mail';

@Module({
  providers: [EmailService, EmailListener],
  imports: [TypeOrmModule.forFeature([Email]), MailModule],
  exports: [EmailService],
})
export class EmailModule {}
