import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities';
import { EmailStatus } from './enums';
import { EntityManager, IsNull, MoreThan, Repository } from 'typeorm';
import {
  BaseException,
  CreateEmailPayload,
  CreateEmailResponse,
  EmailResponse,
  FindActiveEmailPayload,
  UpdateEmailStatusPayload,
  ValidateEmailTokenPayload,
} from '@/types';
import { checkDatabaseError, generateRandomToken, getServerDateTime, hashToken } from '@/lib';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from 'ms';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get the appropriate Email repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Email> {
    return manager?.getRepository(Email) ?? this.emailRepository;
  }

  /**
   * Create a new email token.
   */
  async createEmail(payload: CreateEmailPayload): Promise<CreateEmailResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const existingEmail = await repository.findOne({
        where: {
          userId: payload.userId,
          type: payload.type,
          usedAt: IsNull(),
          revokedAt: IsNull(),
        },
      });

      if (existingEmail) {
        existingEmail.revokedAt = getServerDateTime();
        await repository.save(existingEmail);
      }

      const token = generateRandomToken();
      const tokenHash = hashToken(token);

      const expiresIn = this.configService.getOrThrow<StringValue>('EMAIL_EXPIRES');

      const expiresAt = new Date(getServerDateTime().getTime() + ms(expiresIn));

      const email = repository.create({
        userId: payload.userId,
        tokenHash,
        type: payload.type,
        status: EmailStatus.PENDING,
        expiresAt,
      });

      await repository.save(email);

      return {
        token,
        emailId: email.id,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Email',
      });
    }
  }

  /**
   * Find an active email token for a user.
   */
  async findActiveEmail(payload: FindActiveEmailPayload): Promise<EmailResponse | null> {
    const repository = this.getRepository(payload.manager);

    const email = await repository.findOne({
      where: {
        userId: payload.userId,
        type: payload.type,
        usedAt: IsNull(),
        revokedAt: IsNull(),
        expiresAt: MoreThan(getServerDateTime()),
      },
    });

    if (!email) {
      return null;
    }

    return {
      email,
    };
  }

  /**
   * Validate an email token.
   */
  async validateEmailToken(payload: ValidateEmailTokenPayload): Promise<string> {
    const repository = this.getRepository(payload.manager);

    try {
      const email = await repository.findOne({
        where: {
          tokenHash: hashToken(payload.token),
          type: payload.type,
          usedAt: IsNull(),
          revokedAt: IsNull(),
          expiresAt: MoreThan(getServerDateTime()),
        },
      });

      if (!email) {
        throw new BadRequestException({
          message: 'Invalid or expired email token.',
          error: 'Invalid Token',
        } as BaseException);
      }

      email.usedAt = getServerDateTime();

      await repository.save(email);

      return email.userId;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Email',
      });
    }
  }

  /**
   * Revoke an active email token.
   */
  async revokeEmail(payload: FindActiveEmailPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const email = await this.findActiveEmail(payload);

      if (!email) {
        return;
      }

      email.email.revokedAt = getServerDateTime();

      await repository.save(email.email);
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Email',
      });
    }
  }

  /**
   * Update the delivery status of an email.
   */
  async updateEmailStatus(payload: UpdateEmailStatusPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const updateData: Partial<Email> = {
        status: payload.status,
      };

      if (payload.status === EmailStatus.SENT) {
        updateData.sentAt = getServerDateTime();
        updateData.failedAt = null;
        updateData.errorMessage = null;
      }

      if (payload.status === EmailStatus.FAILED) {
        updateData.failedAt = getServerDateTime();
        updateData.errorMessage = payload.errorMessage ?? null;
      }

      await repository.update(payload.emailId, updateData);
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Email',
      });
    }
  }
}
