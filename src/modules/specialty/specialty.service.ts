import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Specialty } from './entities';
import {
  CreateSpecialtyPayload,
  DeleteSpecialtyPayload,
  FindSpecialtiesPayload,
  FindSpecialtyByIdPayload,
  FindSpecialtyBySlugPayload,
  SpecialtiesResponse,
  SpecialtyResponse,
  UpdateSpecialtyPayload,
} from '@/types/specialty.types';
import { BaseException } from '@/types';
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
   *
   * - Creates and persists a specialty.
   * - Handles database constraint errors such as duplicate names and slugs.
   * - Returns the created specialty.
   */
  async create(payload: CreateSpecialtyPayload): Promise<SpecialtyResponse> {
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
   * Find all specialties.
   *
   * - Returns all available specialties.
   * - Can later be extended with pagination, filtering and sorting.
   */
  async findAll(payload: FindSpecialtiesPayload): Promise<SpecialtiesResponse> {
    const repository = this.getRepository(payload.manager);

    const specialties = await repository.find();

    return {
      specialties,
    };
  }

  /**
   * Find a specialty by ID.
   *
   * - Searches for a specialty using its unique ID.
   * - Throws NotFoundException if the specialty does not exist.
   */
  async findById(payload: FindSpecialtyByIdPayload): Promise<SpecialtyResponse> {
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
   * - Searches for a specialty using its unique slug.
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
   * Update an existing specialty.
   *
   * - Updates only the provided specialty fields.
   * - Sensitive fields such as status are handled by dedicated business methods.
   * - Throws NotFoundException if the specialty does not exist.
   */
  async update(payload: UpdateSpecialtyPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.update(
        { id: payload.id },
        {
          ...(payload.name !== undefined && {
            name: payload.name,
          }),
          ...(payload.slug !== undefined && {
            slug: payload.slug,
          }),
          ...(payload.description !== undefined && {
            description: payload.description,
          }),
        },
      );

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Specialty not found in database.',
          error: 'Specialty Not Found',
        } as BaseException);
      }
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
   * - Marks the specialty as deleted instead of permanently removing it.
   * - Preserves the specialty record for auditing or recovery.
   */
  async delete(payload: DeleteSpecialtyPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    const { specialty } = await this.findById({
      id: payload.id,
      manager: payload.manager,
    });

    await repository.softRemove(specialty);
  }
}
