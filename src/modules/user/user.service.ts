import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseException,
  CreateUserPayload,
  FindUserByEmailPayload,
  GetUserByIdPayload,
  UpdatePasswordParams,
  UpdateProfileParams,
  UpdateUserStatusPayload,
  UserResponse,
} from '@/types';
import { checkDatabaseError, getSafeUser } from '@/lib';
import { DatabaseService } from '@/modules/database/database.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Create a new user.
   * - Throws ConflictException if the email already exists.
   */
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

  /**
   * Update the status of a user.
   * - Throws NotFoundException if the user does not exist.
   */
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
   * Get user by id.
   * - Throws NotFoundException if the user does not exist.
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
   * Find user by email.
   * - Returns null if the user does not exist.
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

  /**
   * Find a user by email with the password hash.
   *
   * - Returns the user including the password hash.
   * - Throws UnauthorizedException if the user does not exist.
   */
  async findByEmailWithPassword(email: string): Promise<User> {
    const user = await this.databaseService.dataSource
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid user credentials',
        error: 'Invalid Credentials',
      } as BaseException);
    }

    return user;
  }

  /**
   * Find a user by ID with the password hash.
   *
   * - Returns the user including the password hash.
   * - Throws UnauthorizedException if the user does not exist.
   */
  async findByIdWithPassword(userId: string): Promise<User> {
    const user = await this.databaseService.dataSource
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid user credentials',
        error: 'Invalid Credentials',
      } as BaseException);
    }

    return user;
  }

  /**
   * Update a user's password.
   *
   * - Updates the user's password hash.
   */
  async updatePassword(params: UpdatePasswordParams): Promise<void> {
    const repository = params.manager?.getRepository(User) ?? this.userRepository;

    await repository.update({ id: params.userId }, { password: params.password });
  }

  /**
   * Update a user's profile.
   *
   * - Updates the provided profile fields.
   * - Returns the updated safe user.
   */
  async updateProfile(params: UpdateProfileParams): Promise<UserResponse> {
    const user = await this.userRepository.preload({
      id: params.userId,
      ...(params.firstName !== undefined && {
        firstName: params.firstName,
      }),
      ...(params.lastName !== undefined && {
        lastName: params.lastName,
      }),
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found in database',
        error: 'User Not Found',
      } as BaseException);
    }

    return getSafeUser(await this.userRepository.save(user));
  }
}
