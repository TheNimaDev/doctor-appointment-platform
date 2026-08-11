import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseException,
  CreateUserPayload,
  DeleteUserParams,
  FindUserByEmailPayload,
  GetUserByIdPayload,
  UpdateEmailParams,
  UpdatePasswordParams,
  UpdateProfileParams,
  UpdateUserStatusPayload,
  UserResponse,
  UserRoleIncludeType,
} from '@/types';
import { checkDatabaseError, compareSecret, getSafeUser } from '@/lib';
import { DatabaseService } from '@/modules/database/database.service';
import { SessionService } from '../session/session.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly databaseService: DatabaseService,
    private readonly sessionService: SessionService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  /**
   * Create a new user.
   *
   * - Creates the user account.
   * - Persists the user in the database.
   * - Returns the created user with roles and permissions.
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

      const savedUser = await repository.save(user);

      return this.getById({
        id: savedUser.id,
        manager: payload.manager,
      });
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
   *
   * - Updates the user's account status.
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
      relations: {
        userRoles: {
          role: {
            rolePermissions: {
              permission: true,
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found in database',
        error: 'User Not Found',
      } as BaseException);
    }

    return getSafeUser(user as UserRoleIncludeType);
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
      relations: {
        userRoles: {
          role: {
            rolePermissions: {
              permission: true,
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return getSafeUser(user as UserRoleIncludeType);
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
   * Update the current user's profile.
   *
   * - Updates only provided profile fields.
   * - Validates that the user exists.
   * - Returns the updated user with roles and permissions.
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

    await this.userRepository.save(user);

    return this.getById({
      id: params.userId,
    });
  }

  /**
   * Update a user's email address.
   *
   * - Updates the user's email.
   * - Throws NotFoundException if the user does not exist.
   */
  async updateEmail(params: UpdateEmailParams): Promise<void> {
    const repository = params.manager?.getRepository(User) ?? this.userRepository;

    const result = await repository.update(
      {
        id: params.userId,
      },
      {
        email: params.email,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'User not found in database',
        error: 'User Not Found',
      } as BaseException);
    }
  }

  /**
   * Delete the current user's account.
   *
   * - Validates the current password.
   * - Soft-deletes the user account.
   * - Revokes all active refresh tokens.
   * - Revokes all active sessions.
   * - Preserves the user's data for recovery or auditing.
   */
  async deleteUser(params: DeleteUserParams): Promise<void> {
    const user = await this.findByIdWithPassword(params.userId);

    const isPasswordValid = await compareSecret(params.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Current password is incorrect.',
        error: 'Invalid Current Password',
      } as BaseException);
    }

    await this.databaseService.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(User);

      const result = await repository.softDelete({
        id: params.userId,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'User not found in database.',
          error: 'User Not Found',
        } as BaseException);
      }

      await this.refreshTokenService.revokeUserRefreshTokens({
        userId: params.userId,
        manager,
      });

      await this.sessionService.revokeUserSessions({
        userId: params.userId,
        manager,
      });
    });
  }
}
