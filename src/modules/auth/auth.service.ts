import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { User } from '@/modules/user/entities';
import { RegisterParams, VerifyEmailParams } from '@/types';
import { checkDatabaseError, getSafeUser, hashSecret } from '@/lib';
import { EmailService } from '../email/email.service';
import { EVENTS } from '@/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserStatus } from '@/modules/user/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(params: RegisterParams): Promise<void> {
    const safeUser = await this.databaseService.dataSource.transaction(async (manager) => {
      const hashedPassword = await hashSecret(params.password);

      try {
        const user = manager.create(User, {
          ...params,
          password: hashedPassword,
        });

        await manager.save(user);

        return getSafeUser(user).user;
      } catch (error) {
        checkDatabaseError({
          e: error as Error,
          mainResource: 'User',
          conflictField: 'email',
        });
      }
    });

    const token = await this.emailService.create({ userId: safeUser.id });
    console.log(token); // TODO: Remove before production

    try {
      this.eventEmitter.emit(EVENTS.SIGNUP_VERIFICATION, {
        email: safeUser.email,
        token,
      });
    } catch (_) {}
  }

  async verifyEmail(params: VerifyEmailParams): Promise<void> {
    const userId = await this.emailService.verify(params);
    await this.databaseService.dataSource.manager.update(User, userId, {
      status: UserStatus.ACTIVE,
    });
  }
}
