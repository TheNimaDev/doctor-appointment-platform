import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities';

@Module({
  providers: [RefreshTokenService],
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
