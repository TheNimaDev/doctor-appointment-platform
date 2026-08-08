import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Session } from './entities';
import {
  BaseException,
  CreateSessionPayload,
  FindActiveUserSessionPayload,
  FindSessionByIdPayload,
  FindUserSessionsOutput,
  FindUserSessionsPayload,
  RevokeSessionPayload,
  RevokeUserSessionsPayload,
  UpdateSessionPayload,
} from '@/types';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  /**
   * Create a new session for a user.
   */
  async createSession(payload: CreateSessionPayload): Promise<Session> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    const session = repository.create({
      userId: payload.userId,
      remember: payload.remember,
      ...payload.clientInfo,
      lastActiveAt: new Date(),
    });

    return repository.save(session);
  }

  /**
   * Find all active sessions for a user.
   * - Includes associated refresh tokens.
   */
  async findActiveUserSessions(payload: FindUserSessionsPayload): Promise<FindUserSessionsOutput> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    return repository.find({
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
  }

  /**
   * Find all sessions for a user.
   * - Includes active and revoked sessions.
   */
  async findUserSessions(payload: FindUserSessionsPayload): Promise<FindUserSessionsOutput> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    return repository.find({
      where: {
        userId: payload.userId,
      },
      order: {
        lastActiveAt: 'DESC',
      },
    });
  }

  /**
   * Find an active session for a user by client information.
   * - Returns null if no active session is found.
   */
  async findActiveUserSession(payload: FindActiveUserSessionPayload): Promise<Session | null> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    return repository.findOne({
      where: {
        userId: payload.userId,
        userAgent: payload.clientInfo.userAgent,
        revokedAt: IsNull(),
      },
    });
  }

  /**
   * Find an active session by id.
   * - Returns null if the session does not exist or has been revoked.
   */
  async findById(payload: FindSessionByIdPayload): Promise<Session | null> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    return repository.findOne({
      where: {
        id: payload.id,
        revokedAt: IsNull(),
      },
    });
  }

  /**
   * Update an active session's last active time and optional remember preference.
   * - Throws NotFoundException if the active session does not exist.
   */
  async updateSession(payload: UpdateSessionPayload): Promise<void> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    const result = await repository.update(
      {
        id: payload.sessionId,
        revokedAt: IsNull(),
      },
      {
        ...(payload.remember !== undefined && {
          remember: payload.remember,
        }),
        lastActiveAt: new Date(),
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Active session not found in database',
        error: 'Session Not Found',
      } as BaseException);
    }
  }

  /**
   * Revoke an active session.
   * - Throws NotFoundException if the active session does not exist.
   */
  async revokeSession(payload: RevokeSessionPayload): Promise<void> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    const result = await repository.update(
      {
        id: payload.sessionId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Active session not found in database',
        error: 'Session Not Found',
      } as BaseException);
    }
  }

  /**
   * Revoke all active sessions belonging to a user.
   */
  async revokeUserSessions(payload: RevokeUserSessionsPayload): Promise<void> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    await repository.update(
      {
        userId: payload.userId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }
}
