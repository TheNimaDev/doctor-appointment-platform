import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities';
import { EmailStatus } from './enums';
import { IsNull, MoreThan, Repository } from 'typeorm';
import {
  BaseException,
  CreateEmailOutput,
  CreateEmailParams,
  FindActiveEmailParams,
  UpdateEmailStatusParams,
  ValidateEmailTokenParams,
} from '@/types';
import { generateRandomToken, hashToken } from '@/lib';
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
   * Create a new email token.
   *
   * - Revokes the existing active token of the same type.
   * - Generates a new random token.
   * - Stores only the hashed token.
   */
  async createEmail(params: CreateEmailParams): Promise<CreateEmailOutput> {
    const repository = params.manager?.getRepository(Email) ?? this.emailRepository;

    const existingEmail = await repository.findOne({
      where: {
        userId: params.userId,
        type: params.type,
        usedAt: IsNull(),
        revokedAt: IsNull(),
      },
    });

    if (existingEmail) {
      existingEmail.revokedAt = new Date();
      await repository.save(existingEmail);
    }

    const token = generateRandomToken();
    const tokenHash = hashToken(token);

    const expiresIn = this.configService.getOrThrow<StringValue>('EMAIL_EXPIRES');

    const expiresAt = new Date(Date.now() + ms(expiresIn));

    const email = repository.create({
      userId: params.userId,
      tokenHash,
      type: params.type,
      status: EmailStatus.PENDING,
      expiresAt,
    });

    await repository.save(email);

    return {
      token,
      emailId: email.id,
    };
  }

  /**
   * Find an active email token for a user.
   */
  async findActiveEmail(params: FindActiveEmailParams): Promise<Email | null> {
    const repository = params.manager?.getRepository(Email) ?? this.emailRepository;

    return repository.findOne({
      where: {
        userId: params.userId,
        type: params.type,
        usedAt: IsNull(),
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  /**
   * Verify and consume an email token.
   */
  async validateEmailToken(params: ValidateEmailTokenParams): Promise<string> {
    const repository = params.manager?.getRepository(Email) ?? this.emailRepository;

    const email = await repository.findOne({
      where: {
        tokenHash: hashToken(params.token),
        type: params.type,
        usedAt: IsNull(),
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!email) {
      throw new BadRequestException({
        message: 'Invalid or expired email token',
        error: 'Invalid Token',
      } as BaseException);
    }

    email.usedAt = new Date();

    await repository.save(email);

    return email.userId;
  }

  /**
   * Revoke an active email token.
   */
  async revokeEmail(params: FindActiveEmailParams): Promise<void> {
    const repository = params.manager?.getRepository(Email) ?? this.emailRepository;

    const email = await this.findActiveEmail(params);

    if (!email) {
      return;
    }

    email.revokedAt = new Date();

    await repository.save(email);
  }

  /**
   * Update the delivery status of an email.
   *
   * - Marks the email as sent and records the send time on success.
   * - Marks the email as failed and stores the failure details on error.
   */
  async updateEmailStatus(params: UpdateEmailStatusParams): Promise<void> {
    const updateData: Partial<Email> = {
      status: params.status,
    };

    if (params.status === EmailStatus.SENT) {
      updateData.sentAt = new Date();
      updateData.failedAt = null;
      updateData.errorMessage = null;
    }

    if (params.status === EmailStatus.FAILED) {
      updateData.failedAt = new Date();
      updateData.errorMessage = params.errorMessage ?? null;
    }

    await this.emailRepository.update(params.emailId, updateData);
  }
}
