import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RolePermission } from './entities';
import {
  AddRolePermissionPayload,
  FindRolePermissionPayload,
  RolePermissionResponse,
  RemoveRolePermissionPayload,
  FindRolePermissionsPayload,
  RolePermissionsResponse,
} from '@/types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';
import { PermissionService } from '@/modules/permission/permission.service';
import { RoleService } from '@/modules/role/role.service';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,

    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}

  /**
   * Get the appropriate Role-Permission repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<RolePermission> {
    return manager?.getRepository(RolePermission) ?? this.rolePermissionRepository;
  }

  /**
   * Add a permission to a role.
   */
  async add(payload: AddRolePermissionPayload): Promise<RolePermissionResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { role } = await this.roleService.getById({
        id: payload.roleId,
        manager: payload.manager,
      });

      const { permission } = await this.permissionService.getById({
        id: payload.permissionId,
        manager: payload.manager,
      });

      const existing = await repository.findOne({
        where: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });

      if (existing) {
        throw new ConflictException({
          message: 'This permission is already assigned to the role.',
          error: 'Role Permission Already Exists',
        } as BaseException);
      }

      const rolePermission = repository.create({
        roleId: role.id,
        permissionId: permission.id,
      });

      const savedRolePermission = await repository.save(rolePermission);

      return {
        rolePermission: savedRolePermission,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Role Permission',
      });
    }
  }

  /**
   * Find all permissions assigned to a role.
   */
  async findAll(payload: FindRolePermissionsPayload): Promise<RolePermissionsResponse> {
    const repository = this.getRepository(payload.manager);

    const { role } = await this.roleService.getById({
      id: payload.roleId,
      manager: payload.manager,
    });

    const rolePermissions = await repository.find({
      where: {
        roleId: role.id,
      },
    });

    return {
      rolePermissions,
    };
  }

  /**
   * Find a specific role-permission relation.
   */
  async findOne(payload: FindRolePermissionPayload): Promise<RolePermissionResponse> {
    const repository = this.getRepository(payload.manager);

    const { role } = await this.roleService.getById({
      id: payload.roleId,
      manager: payload.manager,
    });

    const { permission } = await this.permissionService.getById({
      id: payload.permissionId,
      manager: payload.manager,
    });

    const rolePermission = await repository.findOne({
      where: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    if (!rolePermission) {
      throw new NotFoundException({
        message: 'Role permission relation not found in database.',
        error: 'Role Permission Not Found',
      } as BaseException);
    }

    return {
      rolePermission,
    };
  }

  /**
   * Remove a permission from a role.
   */
  async remove(payload: RemoveRolePermissionPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const { role } = await this.roleService.getById({
        id: payload.roleId,
        manager: payload.manager,
      });

      const result = await repository.softDelete({
        roleId: role.id,
        permissionId: payload.permissionId,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Role permission relation not found in database.',
          error: 'Role Permission Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Role Permission',
      });
    }
  }
}
