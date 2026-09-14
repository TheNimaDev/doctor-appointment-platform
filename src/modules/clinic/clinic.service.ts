import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Clinic } from './entities';
import {
  ClinicResponse,
  ClinicsResponse,
  CreateClinicPayload,
  DeleteClinicPayload,
  FindClinicByIdPayload,
  FindClinicByOwnerIdPayload,
  FindClinicsPayload,
  ResolveClinicPayload,
  UpdateClinicPayload,
} from '@/types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';
import { ClinicStatus } from './enums';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
  ) {}

  /**
   * Get the appropriate Clinic repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Clinic> {
    return manager?.getRepository(Clinic) ?? this.clinicRepository;
  }

  /**
   * Create a new clinic.
   */
  async create(payload: CreateClinicPayload): Promise<ClinicResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const clinic = repository.create({
        ownerId: payload.ownerId,
        name: payload.name,
        address: payload.address,
        city: payload.city,
        phone: payload.phone,
        latitude: payload.latitude?.toString() ?? null,
        longitude: payload.longitude?.toString() ?? null,
        description: payload.description,
      });

      const savedClinic = await repository.save(clinic);

      return {
        clinic: savedClinic,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Clinic',
        conflictField: 'name',
        notFoundField: 'ownerId',
        notFoundResource: 'User',
      });
    }
  }

  /**
   * Find all clinics.
   */
  async findAll(payload: FindClinicsPayload): Promise<ClinicsResponse> {
    const repository = this.getRepository(payload.manager);

    const status = payload?.status ? payload.status : ClinicStatus.ACTIVE;

    const clinics = await repository.find({
      where: {
        status,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      clinics,
    };
  }

  /**
   * Find an active clinic by ID.
   */
  async findActiveById(payload: FindClinicByIdPayload): Promise<ClinicResponse> {
    const repository = this.getRepository(payload.manager);

    const clinic = await repository.findOne({
      where: {
        id: payload.id,
        status: ClinicStatus.ACTIVE,
      },
    });

    if (!clinic) {
      throw new NotFoundException({
        message: 'Clinic not found in database.',
        error: 'Clinic Not Found',
      } as BaseException);
    }

    return {
      clinic,
    };
  }

  /**
   * Find a clinic by ID.
   */
  async findById(payload: FindClinicByIdPayload): Promise<ClinicResponse> {
    const repository = this.getRepository(payload.manager);

    const clinic = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!clinic) {
      throw new NotFoundException({
        message: 'Clinic not found in database.',
        error: 'Clinic Not Found',
      } as BaseException);
    }

    return {
      clinic,
    };
  }

  /**
   * Find clinic belonging to an owner.
   */
  async findByOwnerId(payload: FindClinicByOwnerIdPayload): Promise<ClinicResponse> {
    const repository = this.getRepository(payload.manager);

    const clinic = await repository.findOne({
      where: {
        ownerId: payload.ownerId,
      },
    });

    if (!clinic) {
      throw new NotFoundException({
        message: 'Clinic not found in database.',
        error: 'Clinic Not Found',
      } as BaseException);
    }

    return {
      clinic,
    };
  }

  /**
   * Update an existing clinic.
   */
  async update(payload: UpdateClinicPayload): Promise<ClinicResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { clinic } = await this.resolveClinic(payload);

      const updatedClinic = await repository.preload({
        id: clinic.id,
        ...(payload.name !== undefined && {
          name: payload.name,
        }),
        ...(payload.address !== undefined && {
          address: payload.address,
        }),
        ...(payload.city !== undefined && {
          city: payload.city,
        }),
        ...(payload.phone !== undefined && {
          phone: payload.phone,
        }),
        ...(payload.latitude !== undefined && {
          latitude: payload.latitude?.toString() ?? null,
        }),
        ...(payload.longitude !== undefined && {
          longitude: payload.longitude?.toString() ?? null,
        }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
      });

      if (!updatedClinic) {
        throw new NotFoundException({
          message: 'Clinic not found in database.',
          error: 'Clinic Not Found',
        } as BaseException);
      }

      const savedClinic = await repository.save(updatedClinic);

      return {
        clinic: savedClinic,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Clinic',
        conflictField: 'name',
      });
    }
  }

  /**
   * Soft-delete a clinic.
   */
  async delete(payload: DeleteClinicPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const { clinic } = await this.resolveClinic(payload);

      const result = await repository.softDelete({
        id: clinic.id,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Clinic not found in database.',
          error: 'Clinic Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Clinic',
      });
    }
  }


  /**
   * Resolve a clinic by either owner ID or clinic ID.
   */
  async resolveClinic(payload: ResolveClinicPayload): Promise<ClinicResponse> {
    if ('ownerId' in payload) {
      return this.findByOwnerId({
        ownerId: payload.ownerId,
        manager: payload.manager,
      });
    }

    return this.findById({
      id: payload.clinicId,
      manager: payload.manager,
    });
  }
}
