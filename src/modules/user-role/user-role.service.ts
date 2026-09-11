import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserRole } from './entities';
import {
  AddUserRolePayload,
  FindUserRolePayload,
  FindUserRolesPayload,
  RemoveUserRolePayload,
  UserRoleResponse,
  UserRolesResponse,
} from '@/types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';
import { RoleService } from '@/modules/role/role.service';
import { UserService } from '@/modules/user/user.service';
import { ROLES } from '@/common';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,

    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  /**
   * Get the appropriate User-Role repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<UserRole> {
    return manager?.getRepository(UserRole) ?? this.userRoleRepository;
  }

  /**
   * Add a role to a user.
   */
  async add(payload: AddUserRolePayload): Promise<UserRoleResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { role } = await this.roleService.getById({
        id: payload.roleId,
        manager: payload.manager,
      });

      if (role.name === ROLES.SUPER_ADMIN) {
        throw new BadRequestException({
          message: 'This role cannot be assigned to users.',
          error: 'Protected Role',
        } as BaseException);
      }

      const { user } = await this.userService.getById({
        id: payload.userId,
        manager: payload.manager,
      });

      const isSuperAdmin = user.roles?.some((userRole) => userRole === ROLES.SUPER_ADMIN);

      if (isSuperAdmin) {
        throw new BadRequestException({
          message: 'SUPER_ADMIN cannot have additional roles.',
          error: 'Protected Role',
        } as BaseException);
      }

      const existing = await repository.findOne({
        where: {
          userId: payload.userId,
          roleId: payload.roleId,
        },
      });

      if (existing) {
        throw new ConflictException({
          message: 'This role is already assigned to the user.',
          error: 'User Role Already Exists',
        } as BaseException);
      }

      const userRole = repository.create({
        userId: payload.userId,
        roleId: payload.roleId,
      });

      const savedUserRole = await repository.save(userRole);

      return {
        userRole: savedUserRole,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'User Role',
      });
    }
  }

  /**
   * Find all roles assigned to a user.
   */
  async findAll(payload: FindUserRolesPayload): Promise<UserRolesResponse> {
    const repository = this.getRepository(payload.manager);

    const { user } = await this.userService.getById({
      id: payload.userId,
      manager: payload.manager,
    });

    const userRoles = await repository.find({
      where: {
        userId: user.id,
      },
    });

    return {
      userRoles,
    };
  }

  /**
   * Find a specific user-role relation.
   */
  async findOne(payload: FindUserRolePayload): Promise<UserRoleResponse> {
    const repository = this.getRepository(payload.manager);

    const { user } = await this.userService.getById({
      id: payload.userId,
      manager: payload.manager,
    });

    const { role } = await this.roleService.getById({
      id: payload.roleId,
      manager: payload.manager,
    });

    const userRole = await repository.findOne({
      where: {
        userId: user.id,
        roleId: role.id,
      },
    });

    if (!userRole) {
      throw new NotFoundException({
        message: 'User role relation not found in database.',
        error: 'User Role Not Found',
      } as BaseException);
    }

    return {
      userRole,
    };
  }

  /**
   * Remove a role from a user.
   */
  async remove(payload: RemoveUserRolePayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const { user } = await this.userService.getById({
        id: payload.userId,
        manager: payload.manager,
      });

      const { role } = await this.roleService.getById({
        id: payload.roleId,
        manager: payload.manager,
      });

      const result = await repository.softDelete({
        userId: user.id,
        roleId: role.id,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'User role relation not found in database.',
          error: 'User Role Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'User Role',
      });
    }
  }

  /**
   * Assign the SUPER_ADMIN role to a user.
   */
  async assignSuperAdmin(payload: AddUserRolePayload): Promise<UserRoleResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { user } = await this.userService.getById({
        id: payload.userId,
        manager: payload.manager,
      });

      const { role } = await this.roleService.getById({
        id: payload.roleId,
        manager: payload.manager,
      });

      const userRole = repository.create({
        userId: user.id,
        roleId: role.id,
      });

      const savedUserRole = await repository.save(userRole);

      return {
        userRole: savedUserRole,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'User Role',
      });
    }
  }
}
