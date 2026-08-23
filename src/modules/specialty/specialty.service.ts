import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Specialty } from './entities';

import {
  BaseException,
  CreateSpecialtyPayload,
  DeleteSpecialtyPayload,
  FindSpecialtiesPayload,
  FindSpecialtyByIdPayload,
  FindSpecialtyBySlugPayload,
  SpecialtiesResponse,
  SpecialtyResponse,
  UpdateSpecialtyPayload,
} from '@/types';

import { checkDatabaseError } from '@/lib';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  /**
   * Get the appropriate Specialty repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default Specialty repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Specialty> {
    return manager?.getRepository(Specialty) ?? this.specialtyRepository;
  }

  /**
   * Create a new specialty.
   */
  async createSpecialty(payload: CreateSpecialtyPayload): Promise<SpecialtyResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const specialty = repository.create({
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
      });

      const savedSpecialty = await repository.save(specialty);

      return {
        specialty: savedSpecialty,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Specialty',
        conflictField: ['name', 'slug'],
      });
    }
  }

  /**
   * Get all specialties.
   */
  async findAll(payload: FindSpecialtiesPayload): Promise<SpecialtiesResponse> {
    const repository = this.getRepository(payload.manager);

    const specialties = await repository.find({
      order: {
        name: 'ASC',
      },
    });

    return {
      specialties,
    };
  }

  /**
   * Get a specialty by ID.
   *
   * - Throws NotFoundException if the specialty does not exist.
   */
  async getById(payload: FindSpecialtyByIdPayload): Promise<SpecialtyResponse> {
    const repository = this.getRepository(payload.manager);

    const specialty = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!specialty) {
      throw new NotFoundException({
        message: 'Specialty not found in database.',
        error: 'Specialty Not Found',
      } as BaseException);
    }

    return {
      specialty,
    };
  }

  /**
   * Find a specialty by slug.
   *
   * - Throws NotFoundException if the specialty does not exist.
   */
  async findBySlug(payload: FindSpecialtyBySlugPayload): Promise<SpecialtyResponse> {
    const repository = this.getRepository(payload.manager);

    const specialty = await repository.findOne({
      where: {
        slug: payload.slug,
      },
    });

    if (!specialty) {
      throw new NotFoundException({
        message: 'Specialty not found in database.',
        error: 'Specialty Not Found',
      } as BaseException);
    }

    return {
      specialty,
    };
  }

  /**
   * Update a specialty.
   *
   * - Updates the specialty name, slug, and/or description.
   * - Throws NotFoundException if the specialty does not exist.
   */
  async updateSpecialty(payload: UpdateSpecialtyPayload): Promise<SpecialtyResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const specialty = await repository.preload({
        id: payload.id,
        ...(payload.name !== undefined && {
          name: payload.name,
        }),
        ...(payload.slug !== undefined && {
          slug: payload.slug,
        }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
      });

      if (!specialty) {
        throw new NotFoundException({
          message: 'Specialty not found in database.',
          error: 'Specialty Not Found',
        } as BaseException);
      }

      const updatedSpecialty = await repository.save(specialty);

      return {
        specialty: updatedSpecialty,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Specialty',
        conflictField: ['name', 'slug'],
      });
    }
  }

  /**
   * Soft-delete a specialty.
   *
   * - Throws NotFoundException if the specialty does not exist.
   */
  async deleteSpecialty(payload: DeleteSpecialtyPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    const result = await repository.softDelete({
      id: payload.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Specialty not found in database.',
        error: 'Specialty Not Found',
      } as BaseException);
    }
  }
}
