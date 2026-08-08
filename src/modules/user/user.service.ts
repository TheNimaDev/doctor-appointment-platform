import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseException,
  CreateUserPayload,
  FindUserByEmailPayload,
  GetUserByIdPayload,
  UpdateUserStatusPayload,
  UserResponse,
} from '@/types';
import { checkDatabaseError, getSafeUser } from '@/lib';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(payload: CreateUserPayload): Promise<UserResponse> {
    try {
      const repository = payload.manager?.getRepository(User) ?? this.userRepository;

      const user = repository.create({
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: payload.password,
      });

      return getSafeUser(await repository.save(user));
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'User',
        conflictField: 'email',
      });
    }
  }

  async updateUserStatus(payload: UpdateUserStatusPayload): Promise<void> {
    try {
      const repository = payload.manager?.getRepository(User) ?? this.userRepository;

      const result = await repository.update(
        {
          id: payload.userId,
        },
        {
          status: payload.status,
        },
      );

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'User not found in database',
          error: 'User Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'User',
      });
    }
  }

  /**
   * Get user by id
   * - Throws NotFoundException if user does not exist
   */
  async getById(payload: GetUserByIdPayload): Promise<UserResponse> {
    const repository = payload.manager?.getRepository(User) ?? this.userRepository;

    const user = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found in database',
        error: 'User Not Found',
      } as BaseException);
    }

    return getSafeUser(user);
  }

  /**
   * Find user by email
   * - Used to check if email exists
   */
  async findByEmail(payload: FindUserByEmailPayload): Promise<UserResponse | null> {
    const repository = payload.manager?.getRepository(User) ?? this.userRepository;

    const user = await repository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return null;
    }

    return getSafeUser(user);
  }
}
