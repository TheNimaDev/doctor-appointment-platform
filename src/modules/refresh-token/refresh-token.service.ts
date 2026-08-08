import { generateRandomToken, hashToken } from '@/lib';
import {
  CreateRefreshTokenOutput,
  CreateRefreshTokenPayload,
  FindActiveRefreshTokenPayload,
  FindValidRefreshTokenPayload,
  RevokeUserRefreshTokensPayload,
  RevokeRefreshTokenByConditionPayload,
  RevokeRefreshTokenHashPayload,
  RevokeRefreshTokenPayload,
} from '@/types';
import { Injectable } from '@nestjs/common';
import { IsNull, MoreThan, Repository } from 'typeorm';
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

  /**
   * Create a new refresh token for a session.
   * - Revokes the existing active refresh token for the session.
   * - Returns the raw token and its maximum age.
   */
  async createRefreshToken(payload: CreateRefreshTokenPayload): Promise<CreateRefreshTokenOutput> {
    const repository = payload.manager?.getRepository(RefreshToken) ?? this.refreshTokenRepository;

    const existingToken = await this.findActiveRefreshToken({ sessionId: payload.sessionId, manager: payload.manager });

    if (existingToken) {
      await this.revokeRefreshTokenByHash({ tokenHash: existingToken.tokenHash, manager: payload.manager });
    }

    const refreshToken = generateRandomToken();

    const tokenHash = hashToken(refreshToken);

    const expiresIn = payload.remember
      ? this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_REMEMBER_EXPIRES')
      : this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_EXPIRES');

    const maxAge = ms(expiresIn);
    const expiresAt = new Date(Date.now() + maxAge);

    const refreshTokenEntity = repository.create({
      ...payload.clientInfo,
      sessionId: payload.sessionId,
      tokenHash,
      expiresAt,
    });

    await repository.save(refreshTokenEntity);

    return {
      token: refreshToken,
      maxAge,
    };
  }

  /**
   * Find the active and non-expired refresh token for a session.
   * - Returns null if no active refresh token is found.
   */
  async findActiveRefreshToken(payload: FindActiveRefreshTokenPayload): Promise<RefreshToken | null> {
    const repository = payload.manager?.getRepository(RefreshToken) ?? this.refreshTokenRepository;

    return repository.findOne({
      where: {
        sessionId: payload.sessionId,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  /**
   * Find a valid refresh token by its raw token.
   * - The token must be active and non-expired.
   * - Includes the associated session and user.
   */
  async findValidRefreshToken(payload: FindValidRefreshTokenPayload): Promise<RefreshToken | null> {
    const repository = payload.manager?.getRepository(RefreshToken) ?? this.refreshTokenRepository;

    return repository.findOne({
      where: {
        tokenHash: hashToken(payload.token),
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

  /**
   * Revoke a refresh token using its existing hash.
   * - Does nothing if the token is already revoked or does not exist.
   */
  async revokeRefreshTokenByHash(payload: RevokeRefreshTokenHashPayload): Promise<void> {
    await this.revokeRefreshTokenByCondition({
      manager: payload.manager,
      where: {
        tokenHash: payload.tokenHash,
      },
    });
  }

  /**
   * Revoke a refresh token using its raw token.
   * - The raw token is hashed before querying the database.
   */
  async revokeRefreshToken(payload: RevokeRefreshTokenPayload): Promise<void> {
    const tokenHash = hashToken(payload.token);

    await this.revokeRefreshTokenByCondition({
      manager: payload.manager,
      where: {
        tokenHash,
      },
    });
  }

  /**
   * Revoke all active refresh tokens belonging to a user.
   * - Does nothing if the user has no active refresh tokens.
   */
  async revokeUserRefreshTokens(payload: RevokeUserRefreshTokensPayload): Promise<void> {
    const repository = payload.manager?.getRepository(RefreshToken) ?? this.refreshTokenRepository;

    await repository
      .createQueryBuilder()
      .update(RefreshToken)
      .set({
        revokedAt: new Date(),
      })
      .where(
        `sessionId IN (
        SELECT id FROM sessions WHERE userId = :userId
      )`,
        { userId: payload.userId },
      )
      .andWhere('revokedAt IS NULL')
      .execute();
  }

  /**
   * Revoke an active refresh token using the provided conditions.
   * - Only non-revoked tokens are updated.
   */
  private async revokeRefreshTokenByCondition(payload: RevokeRefreshTokenByConditionPayload): Promise<void> {
    const repository = payload.manager?.getRepository(RefreshToken) ?? this.refreshTokenRepository;

    await repository.update(
      {
        ...payload.where,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }
}
