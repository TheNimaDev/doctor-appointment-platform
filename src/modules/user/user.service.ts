import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException, CreateUserPayload, UserResponse } from '@/types';
import { getSafeUser } from '@/lib';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(payload: CreateUserPayload): Promise<UserResponse> {
    const repository = payload.manager?.getRepository(User) ?? this.userRepository;

    const user = repository.create({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      password: payload.password,
    });

    return getSafeUser(await repository.save(user));
  }

  /**
   * Get user by id
   * - Throws NotFoundException if user does not exist
   */
  async getById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user)
      throw new NotFoundException({
        message: 'User not exist in database',
        error: 'User Not Found',
      } as BaseException);

    return getSafeUser(user);
  }

  /**
   * Find user by email
   * - Used to check if email exists
   */
  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) return null;

    return getSafeUser(user);
  }
}
