import { generateRandomToken, hashToken } from '@/lib';
import { CreateRefreshTokenPayload } from '@/types';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  async createRefreshToken(payload: CreateRefreshTokenPayload): Promise<string> {
    const refreshToken = generateRandomToken();

    const tokenHash = hashToken(refreshToken);

    const expiresIn = payload.remember
      ? this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_REMEMBER_EXPIRES')
      : this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_EXPIRES');

    const expiresAt = new Date(Date.now() + ms(expiresIn));

    await this.refreshTokenRepository.save({
      ...payload.clientInfo,
      userId: payload.userId,
      tokenHash,
      expiresAt,
    });

    return refreshToken;
  }
}
