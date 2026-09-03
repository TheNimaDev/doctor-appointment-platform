import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { Session } from './entities';
import {
  BaseException,
  CreateSessionPayload,
  FindActiveUserSessionPayload,
  FindSessionByIdPayload,
  FindUserSessionsPayload,
  RevokeSessionPayload,
  RevokeUserSessionsPayload,
  SessionResponse,
  SessionsResponse,
  UpdateSessionPayload,
} from '@/types';
import { checkDatabaseError, getServerDateTime } from '@/lib';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  /**
   * Get the appropriate Session repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Session> {
    return manager?.getRepository(Session) ?? this.sessionRepository;
  }

  /**
   * Create a new session.
   */
  async createSession(payload: CreateSessionPayload): Promise<SessionResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const session = repository.create({
        userId: payload.userId,
        remember: payload.remember,
        ...payload.clientInfo,
        lastActiveAt: getServerDateTime(),
      });

      const savedSession = await repository.save(session);

      return {
        session: savedSession,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Session',
      });
    }
  }

  /**
   * Get all active sessions for a user.
   */
  async findActiveUserSessions(payload: FindUserSessionsPayload): Promise<SessionsResponse> {
    const repository = this.getRepository(payload.manager);

    const sessions = await repository.find({
      where: {
        userId: payload.userId,
        revokedAt: IsNull(),
      },
      relations: {
        refreshTokens: true,
      },
      order: {
        lastActiveAt: 'DESC',
      },
    });

    return {
      sessions,
    };
  }

  /**
   * Get all sessions for a user.
   */
  async findUserSessions(payload: FindUserSessionsPayload): Promise<SessionsResponse> {
    const repository = this.getRepository(payload.manager);

    const sessions = await repository.find({
      where: {
        userId: payload.userId,
      },
      order: {
        lastActiveAt: 'DESC',
      },
    });

    return {
      sessions,
    };
  }

  /**
   * Find an active session for a user.
   */
  async findActiveUserSession(payload: FindActiveUserSessionPayload): Promise<SessionResponse | null> {
    const repository = this.getRepository(payload.manager);

    const session = await repository.findOne({
      where: {
        userId: payload.userId,
        userAgent: payload.clientInfo.userAgent,
        revokedAt: IsNull(),
      },
    });

    if (!session) {
      return null;
    }

    return {
      session,
    };
  }

  /**
   * Get an active session by ID.
   */
  async getById(payload: FindSessionByIdPayload): Promise<SessionResponse | null> {
    const repository = this.getRepository(payload.manager);

    const session = await repository.findOne({
      where: {
        id: payload.id,
        revokedAt: IsNull(),
      },
    });

    if (!session) {
      return null;
    }

    return {
      session,
    };
  }

  /**
   * Update an active session.
   */
  async updateSession(payload: UpdateSessionPayload): Promise<SessionResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const session = await repository.preload({
        id: payload.sessionId,
        ...(payload.remember !== undefined && {
          remember: payload.remember,
        }),
        lastActiveAt: getServerDateTime(),
      });

      if (!session || session.revokedAt !== null) {
        throw new NotFoundException({
          message: 'Active session not found in database.',
          error: 'Session Not Found',
        } as BaseException);
      }

      const updatedSession = await repository.save(session);

      return {
        session: updatedSession,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Session',
      });
    }
  }

  /**
   * Revoke an active session.
   */
  async revokeSession(payload: RevokeSessionPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.update(
        {
          id: payload.sessionId,
          revokedAt: IsNull(),
        },
        {
          revokedAt: getServerDateTime(),
        },
      );

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Active session not found in database.',
          error: 'Session Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Session',
      });
    }
  }

  /**
   * Revoke all active sessions belonging to a user.
   */
  async revokeUserSessions(payload: RevokeUserSessionsPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      await repository.update(
        {
          userId: payload.userId,
          revokedAt: IsNull(),
        },
        {
          revokedAt: getServerDateTime(),
        },
      );
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Session',
      });
    }
  }
}
