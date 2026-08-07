import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities';
import { MoreThan, Repository } from 'typeorm';
import { BaseException, CreateEmailParams, VerifyEmailParams } from '@/types';
import { generateRandomToken, hashToken } from '@/lib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly configService: ConfigService,
  ) {}

  async createEmail(params: CreateEmailParams): Promise<string> {
    const repository = params.manager?.getRepository(Email) ?? this.emailRepository;

    await repository.delete({
      userId: params.userId,
    });

    const token = generateRandomToken();

    const tokenHash = hashToken(token);

    const expiresIn = this.configService.get<number>('EMAIL_EXPIRES', 10);

    const emailAction = repository.create({
      userId: params.userId,
      tokenHash,
      expiresAt: new Date(Date.now() + expiresIn * 60 * 1000),
    });

    await repository.save(emailAction);

    return token;
  }

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
