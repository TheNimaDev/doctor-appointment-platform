import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RolePermission } from './entities';
import {
  AddRolePermissionPayload,
  FindRolePermissionPayload,
  RolePermissionResponse,
  RemoveRolePermissionPayload,
} from '@/types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';
import { PermissionService } from '../permission/permission.service';
import { RoleService } from '../role/role.service';

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
      await this.roleService.getById({
        id: payload.roleId,
        manager: payload.manager,
      });

      await this.permissionService.getById({
        id: payload.permissionId,
        manager: payload.manager,
      });

      const existing = await repository.findOne({
        where: {
          roleId: payload.roleId,
          permissionId: payload.permissionId,
        },
      });

      if (existing) {
        throw new ConflictException({
          message: 'This permission is already assigned to the role.',
          error: 'Role Permission Already Exists',
        } as BaseException);
      }

      const rolePermission = repository.create({
        roleId: payload.roleId,
        permissionId: payload.permissionId,
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
   * Find a specific role-permission relation.
   */
  async findOne(payload: FindRolePermissionPayload): Promise<RolePermissionResponse> {
    const repository = this.getRepository(payload.manager);

    const rolePermission = await repository.findOne({
      where: {
        roleId: payload.roleId,
        permissionId: payload.permissionId,
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
      const result = await repository.softDelete({
        roleId: payload.roleId,
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
