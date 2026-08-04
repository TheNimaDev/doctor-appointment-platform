import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from '@/modules/email';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[EmailModule]
})
export class AuthModule {}
