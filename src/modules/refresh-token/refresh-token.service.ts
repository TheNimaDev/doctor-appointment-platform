import { generateRandomToken, hashToken } from '@/lib';
import { CreateRefreshTokenOutput, CreateRefreshTokenPayload } from '@/types';
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

  async createRefreshToken(payload: CreateRefreshTokenPayload): Promise<CreateRefreshTokenOutput> {
    const refreshToken = generateRandomToken();

    const tokenHash = hashToken(refreshToken);

    const expiresIn = payload.remember
      ? this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_REMEMBER_EXPIRES')
      : this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_EXPIRES');

    const maxAge = ms(expiresIn);
    const expiresAt = new Date(Date.now() + maxAge);

    await this.refreshTokenRepository.save({
      ...payload.clientInfo,
      userId: payload.userId,
      tokenHash,
      expiresAt,
    });

    return {
      token: refreshToken,
      maxAge,
    };
  }
}
