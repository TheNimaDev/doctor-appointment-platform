import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './entities';

@Module({
  providers: [EmailService],
  imports: [TypeOrmModule.forFeature([Email])],
  exports: [EmailService],
})
export class EmailModule {}
