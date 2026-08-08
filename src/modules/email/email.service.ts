import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities';
import { MoreThan, Repository } from 'typeorm';
import { BaseException, CreateEmailParams, VerifyEmailParams } from '@/types';
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
   * Create a new email verification token for a user.
   * - Removes any existing verification token before creating a new one.
   * - Stores only the hashed token in the database.
   */
  async createEmail(params: CreateEmailParams): Promise<string> {
    const repository = params.manager?.getRepository(Email) ?? this.emailRepository;

    await repository.delete({
      userId: params.userId,
    });

    const token = generateRandomToken();

    const tokenHash = hashToken(token);

    const expiresIn = this.configService.getOrThrow<StringValue>('EMAIL_EXPIRES');

    const maxAge = ms(expiresIn);
    const expiresAt = new Date(Date.now() + maxAge);

    const emailAction = repository.create({
      userId: params.userId,
      tokenHash,
      expiresAt,
    });

    await repository.save(emailAction);

    return token;
  }

  /**
   * Verify a user's email using a valid verification token.
   * - Rejects invalid, expired, or already verified tokens.
   * - Marks the email verification token as verified.
   */
  async verifyEmail(params: VerifyEmailParams): Promise<string> {
    const repository = params.manager?.getRepository(Email) ?? this.emailRepository;

    const email = await repository.findOne({
      where: {
        tokenHash: hashToken(params.token),
        isVerified: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!email) {
      throw new BadRequestException({
        message: 'Invalid or expired email verification token',
        error: 'Invalid Token',
      } as BaseException);
    }

    email.isVerified = true;
    email.verifiedAt = new Date();

    await repository.save(email);

    return email.userId;
  }
}
