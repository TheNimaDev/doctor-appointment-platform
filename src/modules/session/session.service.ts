import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Session } from './entities';
import {
  CreateSessionPayload,
  FindActiveUserSessionPayload,
  FindSessionByIdPayload,
  FindUserSessionsOutput,
  FindUserSessionsPayload,
  RevokeSessionPayload,
  RevokeUserSessionsPayload,
  UpdateLastActiveSessionPayload,
} from '@/types';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createSession(payload: CreateSessionPayload): Promise<Session> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    const session = repository.create({
      userId: payload.userId,
      ...payload.clientInfo,
      lastActiveAt: new Date(),
    });

    return repository.save(session);
  }

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

  async findById(payload: FindSessionByIdPayload): Promise<Session | null> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    return repository.findOne({
      where: {
        id: payload.id,
        revokedAt: IsNull(),
      },
    });
  }

  async updateLastActive(payload: UpdateLastActiveSessionPayload): Promise<void> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    await repository.update(
      {
        id: payload.sessionId,
        revokedAt: IsNull(),
      },
      {
        lastActiveAt: new Date(),
      },
    );
  }

  async revokeSession(payload: RevokeSessionPayload): Promise<void> {
    const repository = payload.manager?.getRepository(Session) ?? this.sessionRepository;

    await repository.update(
      {
        id: payload.sessionId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }

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
