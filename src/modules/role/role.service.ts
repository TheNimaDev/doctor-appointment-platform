import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { checkDatabaseError } from '@/lib';
import { Role } from './entities';
import {
  BaseException,
  CreateRolePayload,
  DeleteRolePayload,
  FindRoleByIdPayload,
  FindRoleByNamePayload,
  FindRolesPayload,
  RoleResponse,
  RolesResponse,
  UpdateRolePayload,
} from '@/types';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Get the appropriate Role repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Role> {
    return manager?.getRepository(Role) ?? this.roleRepository;
  }

  /**
   * Create a new role.
   */
  async createRole(payload: CreateRolePayload): Promise<RoleResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const role = repository.create({
        name: payload.name,
        description: payload.description,
      });

      const savedRole = await repository.save(role);

      return {
        role: savedRole,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Role',
        conflictField: 'name',
      });
    }
  }

  /**
   * Get a role by ID.
   */
  async getById(payload: FindRoleByIdPayload): Promise<RoleResponse> {
    const repository = this.getRepository(payload.manager);

    const role = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!role) {
      throw new NotFoundException({
        message: 'Role not found in database.',
        error: 'Role Not Found',
      } as BaseException);
    }

    return {
      role,
    };
  }

  /**
   * Find a role by name.
   */
  async findByName(payload: FindRoleByNamePayload): Promise<RoleResponse | null> {
    const repository = this.getRepository(payload.manager);

    const role = await repository.findOne({
      where: {
        name: payload.name,
      },
    });

    if (!role) {
      return null;
    }

    return {
      role,
    };
  }

  /**
   * Get all roles.
   */
  async findAll(payload: FindRolesPayload): Promise<RolesResponse> {
    const repository = this.getRepository(payload.manager);

    const roles = await repository.find({
      order: {
        name: 'ASC',
      },
    });

    return {
      roles,
    };
  }

  /**
   * Update a role.
   */
  async updateRole(payload: UpdateRolePayload): Promise<RoleResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const role = await repository.preload({
        id: payload.id,
        ...(payload.name !== undefined && {
          name: payload.name,
        }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
      });

      if (!role) {
        throw new NotFoundException({
          message: 'Role not found in database.',
          error: 'Role Not Found',
        } as BaseException);
      }

      const updatedRole = await repository.save(role);

      return {
        role: updatedRole,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Role',
        conflictField: 'name',
      });
    }
  }

  /**
   * Soft-delete a role.
   */
  async deleteRole(payload: DeleteRolePayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.softDelete({
        id: payload.id,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Role not found in database.',
          error: 'Role Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Role',
      });
    }
  }
}
