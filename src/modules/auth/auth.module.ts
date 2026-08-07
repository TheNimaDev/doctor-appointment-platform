import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from '@/modules/email';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenModule } from '@/modules/refresh-token';
import { SessionModule } from '@/modules/session';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [EmailModule, PassportModule, JwtModule.register({}), RefreshTokenModule, SessionModule],
})
export class AuthModule {}
