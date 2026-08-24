import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseException,
  CreateUserPayload,
  DeleteUserPayload,
  FindUserByEmailPayload,
  GetUserByIdPayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
  UpdateUserStatusPayload,
  UserResponse,
  UserRoleIncludeType,
  UserWithPasswordResponse,
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
   * Get the appropriate User repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<User> {
    return manager?.getRepository(User) ?? this.userRepository;
  }

  /**
   * Create a new user.
   */
  async createUser(payload: CreateUserPayload): Promise<UserResponse> {
    const repository = this.getRepository(payload.manager);

    try {
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
   * Update a user's status.
   */
  async updateUserStatus(payload: UpdateUserStatusPayload): Promise<UserResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const user = await repository.preload({
        id: payload.userId,
        status: payload.status,
      });

      if (!user) {
        throw new NotFoundException({
          message: 'User not found in database.',
          error: 'User Not Found',
        } as BaseException);
      }

      await repository.save(user);

      return this.getById({
        id: payload.userId,
        manager: payload.manager,
      });
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
   * Get a user by ID.
   */
  async getById(payload: GetUserByIdPayload): Promise<UserResponse> {
    const repository = this.getRepository(payload.manager);

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
        message: 'User not found in database.',
        error: 'User Not Found',
      } as BaseException);
    }

    return getSafeUser(user as UserRoleIncludeType);
  }

  /**
   * Find a user by email.
   */
  async findByEmail(payload: FindUserByEmailPayload): Promise<UserResponse | null> {
    const repository = this.getRepository(payload.manager);

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
   */
  async findByEmailWithPassword(email: string): Promise<UserWithPasswordResponse> {
    const user = await this.databaseService.dataSource
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid user credentials.',
        error: 'Invalid Credentials',
      } as BaseException);
    }

    return { user };
  }

  /**
   * Find a user by ID with the password hash.
   */
  async findByIdWithPassword(userId: string): Promise<UserWithPasswordResponse> {
    const user = await this.databaseService.dataSource
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid user credentials.',
        error: 'Invalid Credentials',
      } as BaseException);
    }

    return { user };
  }

  /**
   * Update a user's password.
   */
  async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const user = await repository.preload({
        id: payload.userId,
        password: payload.password,
      });

      if (!user) {
        throw new NotFoundException({
          message: 'User not found in database.',
          error: 'User Not Found',
        } as BaseException);
      }

      await repository.save(user);
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
   * Update a user's password.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UserResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const user = await repository.preload({
        id: payload.userId,
        ...(payload.firstName !== undefined && {
          firstName: payload.firstName,
        }),
        ...(payload.lastName !== undefined && {
          lastName: payload.lastName,
        }),
      });

      if (!user) {
        throw new NotFoundException({
          message: 'User not found in database.',
          error: 'User Not Found',
        } as BaseException);
      }

      await repository.save(user);

      return this.getById({
        id: payload.userId,
        manager: payload.manager,
      });
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
   * Update a user's email address.
   */
  async updateEmail(payload: UpdateEmailPayload): Promise<UserResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const user = await repository.preload({
        id: payload.userId,
        email: payload.email,
      });

      if (!user) {
        throw new NotFoundException({
          message: 'User not found in database.',
          error: 'User Not Found',
        } as BaseException);
      }

      await repository.save(user);

      return this.getById({
        id: payload.userId,
        manager: payload.manager,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'User',
        conflictField: 'email',
      });
    }
  }

  /**
   * Soft-delete the current user's account.
   */
  async deleteUser(payload: DeleteUserPayload): Promise<void> {
    const { user } = await this.findByIdWithPassword(payload.userId);

    const isPasswordValid = await compareSecret(payload.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Current password is incorrect.',
        error: 'Invalid Current Password',
      } as BaseException);
    }

    try {
      await this.databaseService.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(User);

        const result = await repository.softDelete({
          id: payload.userId,
        });

        if (result.affected === 0) {
          throw new NotFoundException({
            message: 'User not found in database.',
            error: 'User Not Found',
          } as BaseException);
        }

        await this.refreshTokenService.revokeUserRefreshTokens({
          userId: payload.userId,
          manager,
        });

        await this.sessionService.revokeUserSessions({
          userId: payload.userId,
          manager,
        });
      });
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
}
