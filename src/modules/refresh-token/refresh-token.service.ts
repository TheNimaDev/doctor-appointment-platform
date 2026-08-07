import { generateRandomToken, hashToken } from '@/lib';
import { CreateRefreshTokenOutput, CreateRefreshTokenPayload } from '@/types';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, IsNull, MoreThan, Repository } from 'typeorm';
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
    const existingToken = await this.findActiveRefreshToken(payload.sessionId);

    if (existingToken) {
      await this.revokeRefreshTokenByHash(existingToken.tokenHash);
    }

    const refreshToken = generateRandomToken();

    const tokenHash = hashToken(refreshToken);

    const expiresIn = payload.remember
      ? this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_REMEMBER_EXPIRES')
      : this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_EXPIRES');

    const maxAge = ms(expiresIn);
    const expiresAt = new Date(Date.now() + maxAge);

    await this.refreshTokenRepository.save({
      ...payload.clientInfo,
      sessionId: payload.sessionId,
      tokenHash,
      expiresAt,
    });

    return {
      token: refreshToken,
      maxAge,
    };
  }

  async findActiveRefreshToken(sessionId: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: {
        sessionId: sessionId,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  async findValidRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: {
        tokenHash: hashToken(token),
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      relations: {
        session: {
          user: true,
        },
      },
    });
  }

  async revokeRefreshTokenByHash(tokenHash: string): Promise<void> {
    await this.revokeByCondition({
      tokenHash,
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = hashToken(token);

    await this.revokeByCondition({
      tokenHash,
    });
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({
        revokedAt: new Date(),
      })
      .where(
        `sessionId IN (
        SELECT id FROM sessions WHERE userId = :userId
      )`,
        { userId },
      )
      .andWhere('revokedAt IS NULL')
      .execute();
  }

  private async revokeByCondition(where: FindOptionsWhere<RefreshToken>): Promise<void> {
    await this.refreshTokenRepository.update(
      {
        ...where,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }
}
