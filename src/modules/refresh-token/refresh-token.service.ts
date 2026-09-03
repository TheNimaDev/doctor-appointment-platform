import { generateRandomToken, hashToken, checkDatabaseError, getServerDateTime } from '@/lib';
import {
  CreateRefreshTokenPayload,
  CreateRefreshTokenResponse,
  FindActiveRefreshTokenPayload,
  FindValidRefreshTokenPayload,
  RevokeRefreshTokenByConditionPayload,
  RevokeRefreshTokenHashPayload,
  RevokeRefreshTokenPayload,
  RevokeUserRefreshTokensPayload,
} from '@/types';
import { Injectable } from '@nestjs/common';
import { EntityManager, IsNull, MoreThan, Repository } from 'typeorm';
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
   * Get the appropriate RefreshToken repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<RefreshToken> {
    return manager?.getRepository(RefreshToken) ?? this.refreshTokenRepository;
  }

  /**
   * Create a new refresh token.
   */
  async createRefreshToken(payload: CreateRefreshTokenPayload): Promise<CreateRefreshTokenResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const existingToken = await this.findActiveRefreshToken({
        sessionId: payload.sessionId,
        manager: payload.manager,
      });

      if (existingToken) {
        await this.revokeRefreshTokenByHash({
          tokenHash: existingToken.tokenHash,
          manager: payload.manager,
        });
      }

      const refreshToken = generateRandomToken();
      const tokenHash = hashToken(refreshToken);

      const expiresIn = payload.remember
        ? this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_REMEMBER_EXPIRES')
        : this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_EXPIRES');

      const maxAge = ms(expiresIn);
      const expiresAt = new Date(getServerDateTime().getTime() + maxAge);

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
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'RefreshToken',
      });
    }
  }

  /**
   * Find an active refresh token for a session.
   */
  async findActiveRefreshToken(payload: FindActiveRefreshTokenPayload): Promise<RefreshToken | null> {
    const repository = this.getRepository(payload.manager);

    return repository.findOne({
      where: {
        sessionId: payload.sessionId,
        revokedAt: IsNull(),
        expiresAt: MoreThan(getServerDateTime()),
      },
    });
  }

  /**
   * Find a valid refresh token by its raw token.
   */
  async findValidRefreshToken(payload: FindValidRefreshTokenPayload): Promise<RefreshToken | null> {
    const repository = this.getRepository(payload.manager);

    return repository.findOne({
      where: {
        tokenHash: hashToken(payload.token),
        revokedAt: IsNull(),
        expiresAt: MoreThan(getServerDateTime()),
      },
      relations: {
        session: {
          user: true,
        },
      },
    });
  }

  /**
   * Revoke a refresh token by its hash.
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
   * Revoke a refresh token by its raw token.
   */
  async revokeRefreshToken(payload: RevokeRefreshTokenPayload): Promise<void> {
    await this.revokeRefreshTokenByCondition({
      manager: payload.manager,
      where: {
        tokenHash: hashToken(payload.token),
      },
    });
  }

  /**
   * Revoke all active refresh tokens belonging to a user.
   */
  async revokeUserRefreshTokens(payload: RevokeUserRefreshTokensPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      await repository
        .createQueryBuilder()
        .update(RefreshToken)
        .set({
          revokedAt: getServerDateTime(),
        })
        .where(
          `sessionId IN (
            SELECT id FROM sessions WHERE userId = :userId
          )`,
          { userId: payload.userId },
        )
        .andWhere('revokedAt IS NULL')
        .execute();
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'RefreshToken',
      });
    }
  }

  /**
   * Revoke an active refresh token by the provided conditions.
   */
  private async revokeRefreshTokenByCondition(payload: RevokeRefreshTokenByConditionPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      await repository.update(
        {
          ...payload.where,
          revokedAt: IsNull(),
        },
        {
          revokedAt: getServerDateTime(),
        },
      );
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'RefreshToken',
      });
    }
  }
}
