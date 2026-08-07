import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './entities';
import { Repository } from 'typeorm';
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

  async verify(params: VerifyEmailParams): Promise<string> {
    const email = await this.emailRepository.findOne({
      where: {
        tokenHash: hashToken(params.token),
        isVerified: false,
      },
    });

    if (!email) {
      throw new BadRequestException({
        message: 'Invalid email verification token',
        error: 'Invalid Token',
      } as BaseException);
    }

    if (email.expiresAt < new Date()) {
      throw new BadRequestException({
        message: 'Email verification token expired',
        error: 'Token Expired',
      } as BaseException);
    }

    email.isVerified = true;
    email.verifiedAt = new Date();

    await this.emailRepository.save(email);

    return email.userId;
  }
}
