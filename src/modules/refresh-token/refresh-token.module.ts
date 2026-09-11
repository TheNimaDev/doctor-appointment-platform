import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities';
import { SessionModule } from '../session';

@Module({
  providers: [RefreshTokenService],
  imports: [TypeOrmModule.forFeature([RefreshToken]), SessionModule],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
