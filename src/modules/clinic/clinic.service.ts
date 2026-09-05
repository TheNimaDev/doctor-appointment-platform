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
  UpdateClinicPayload,
  UpdateClinicStatusPayload,
} from '@/types';

import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';

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

    const clinics = await repository.find();

    return {
      clinics,
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
      const { clinic } = await this.findByOwnerId({
        ownerId: payload.ownerId,
      });

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
      const result = await repository.softDelete({
        ownerId: payload.ownerId,
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
   * Update the status of a clinic.
   */
  async updateStatus(payload: UpdateClinicStatusPayload): Promise<ClinicResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const clinic = await repository.preload({
        id: payload.id,
        status: payload.status,
      });

      if (!clinic) {
        throw new NotFoundException({
          message: 'Clinic not found in database.',
          error: 'Clinic Not Found',
        } as BaseException);
      }

      const updatedClinic = await repository.save(clinic);

      return {
        clinic: updatedClinic,
      };
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
}
