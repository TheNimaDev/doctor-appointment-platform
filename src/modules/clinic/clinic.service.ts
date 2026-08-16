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
  FindClinicsByDoctorIdPayload,
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
   * - Falls back to the default Clinic repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Clinic> {
    return manager?.getRepository(Clinic) ?? this.clinicRepository;
  }

  /**
   * Create a new clinic.
   *
   * - Creates and persists a clinic for an existing doctor.
   * - Handles database constraint errors such as duplicate clinic names.
   * - Handles invalid doctor references.
   * - Returns the created clinic.
   */
  async create(payload: CreateClinicPayload): Promise<ClinicResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const clinic = repository.create({
        doctorId: payload.doctorId,
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
        notFoundField: 'doctorId',
        notFoundResource: 'Doctor',
      });
    }
  }

  /**
   * Find all clinics.
   *
   * - Returns all available clinics.
   * - Can later be extended with pagination, filtering and sorting.
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
   *
   * - Searches for a clinic using its unique ID.
   * - Throws NotFoundException if the clinic does not exist.
   */
  async findById(payload: FindClinicByIdPayload): Promise<ClinicResponse> {
    const repository = this.getRepository(payload.manager);

    const clinic = await repository.findOne({
      where: {
        id: payload.id,
        doctorId: payload.doctorId,
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
   * Find all clinics belonging to a doctor.
   *
   * - Returns all clinics associated with the given doctor.
   */
  async findByDoctorId(payload: FindClinicsByDoctorIdPayload): Promise<ClinicsResponse> {
    const repository = this.getRepository(payload.manager);

    const clinics = await repository.find({
      where: {
        doctorId: payload.doctorId,
      },
    });

    return {
      clinics,
    };
  }

  /**
   * Update an existing clinic.
   *
   * - Updates only the provided clinic fields.
   * - Sensitive fields such as status are handled separately.
   * - Throws NotFoundException if the clinic does not exist.
   */
  async update(payload: UpdateClinicPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.update(
        { id: payload.id, doctorId: payload.doctorId },
        {
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
        },
      );

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
        conflictField: 'name',
      });
    }
  }

  /**
   * Soft-delete a clinic.
   *
   * - Marks the clinic as deleted instead of permanently removing it.
   * - Preserves the clinic record for auditing or recovery.
   */
  async delete(payload: DeleteClinicPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    const { clinic } = await this.findById({
      id: payload.id,
      manager: payload.manager,
      doctorId: payload.doctorId,
    });

    await repository.softRemove(clinic);
  }

  /**
   * Update the status of a clinic.
   *
   * - Updates the status of the specified clinic.
   * - Ensures the clinic belongs to the specified doctor.
   * - Throws NotFoundException if the clinic does not exist.
   */
  async updateStatus(payload: UpdateClinicStatusPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.update(
        {
          id: payload.id,
          doctorId: payload.doctorId,
        },
        {
          status: payload.status,
        },
      );

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
}
