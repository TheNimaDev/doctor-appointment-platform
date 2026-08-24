import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Permission } from './entities';

import {
  BaseException,
  CreatePermissionPayload,
  DeletePermissionPayload,
  FindPermissionByIdPayload,
  FindPermissionByNamePayload,
  FindPermissionsPayload,
  PermissionResponse,
  PermissionsResponse,
  UpdatePermissionPayload,
} from '@/types';

import { checkDatabaseError } from '@/lib';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * Get the appropriate Permission repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Permission> {
    return manager?.getRepository(Permission) ?? this.permissionRepository;
  }

  /**
   * Create a new permission.
   */
  async createPermission(payload: CreatePermissionPayload): Promise<PermissionResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const permission = repository.create({
        name: payload.name,
        module: payload.module,
        action: payload.action,
        description: payload.description,
      });

      const savedPermission = await repository.save(permission);

      return {
        permission: savedPermission,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Permission',
        conflictField: 'name',
      });
    }
  }

  /**
   * Get a permission by ID.
   */
  async getById(payload: FindPermissionByIdPayload): Promise<PermissionResponse> {
    const repository = this.getRepository(payload.manager);

    const permission = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!permission) {
      throw new NotFoundException({
        message: 'Permission not found in database.',
        error: 'Permission Not Found',
      } as BaseException);
    }

    return {
      permission,
    };
  }

  /**
   * Find a permission by name.
   */
  async findByName(payload: FindPermissionByNamePayload): Promise<PermissionResponse | null> {
    const repository = this.getRepository(payload.manager);

    const permission = await repository.findOne({
      where: {
        name: payload.name,
      },
    });

    if (!permission) {
      return null;
    }

    return {
      permission,
    };
  }

  /**
   * Get all permissions.
   */
  async findAll(payload: FindPermissionsPayload): Promise<PermissionsResponse> {
    const repository = this.getRepository(payload.manager);

    const permissions = await repository.find({
      order: {
        name: 'ASC',
      },
    });

    return {
      permissions,
    };
  }

  /**
   * Update a permission.
   */
  async updatePermission(payload: UpdatePermissionPayload): Promise<PermissionResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const permission = await repository.preload({
        id: payload.id,
        ...(payload.name !== undefined && {
          name: payload.name,
        }),
        ...(payload.module !== undefined && {
          module: payload.module,
        }),
        ...(payload.action !== undefined && {
          action: payload.action,
        }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
      });

      if (!permission) {
        throw new NotFoundException({
          message: 'Permission not found in database.',
          error: 'Permission Not Found',
        } as BaseException);
      }

      const updatedPermission = await repository.save(permission);

      return {
        permission: updatedPermission,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Permission',
        conflictField: 'name',
      });
    }
  }

  /**
   * Soft-delete a permission.
   */
  async deletePermission(payload: DeletePermissionPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    const result = await repository.softDelete({
      id: payload.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Permission not found in database.',
        error: 'Permission Not Found',
      } as BaseException);
    }
  }
}
