import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Session } from './entities';
import { CreateSessionPayload, FindActiveUserSessionPayload, FindUserSessionsOutput } from '@/types';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createSession(payload: CreateSessionPayload): Promise<Session> {
    const session = this.sessionRepository.create({
      ...payload,
      lastActiveAt: new Date(),
    });

    return this.sessionRepository.save(session);
  }

  async findActiveUserSessions(userId: string): Promise<FindUserSessionsOutput> {
    return this.sessionRepository.find({
      where: {
        userId,
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

  async findUserSessions(userId: string): Promise<FindUserSessionsOutput> {
    return this.sessionRepository.find({
      where: {
        userId,
      },
      order: {
        lastActiveAt: 'DESC',
      },
    });
  }

  async findActiveUserSession(payload: FindActiveUserSessionPayload): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        userId: payload.userId,
        userAgent: payload.clientInfo.userAgent,
        revokedAt: IsNull(),
      },
    });
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        id,
        revokedAt: IsNull(),
      },
    });
  }

  async updateLastActive(sessionId: string): Promise<void> {
    await this.sessionRepository.update(
      {
        id: sessionId,
        revokedAt: IsNull(),
      },
      {
        lastActiveAt: new Date(),
      },
    );
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.sessionRepository.update(
      {
        id: sessionId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }

  async revokeUserSessions(userId: string): Promise<void> {
    await this.sessionRepository.update(
      {
        userId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }
}
