import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { DoctorClinic } from './entities';

import {
  CreateDoctorClinicPayload,
  DeleteDoctorClinicPayload,
  DoctorClinicResponse,
  DoctorClinicsResponse,
  FindDoctorClinicByDoctorAndClinicPayload,
  FindDoctorClinicsByClinicIdPayload,
  FindDoctorClinicsByDoctorIdPayload,
} from '@/types';

import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';

@Injectable()
export class DoctorClinicService {
  constructor(
    @InjectRepository(DoctorClinic)
    private readonly doctorClinicRepository: Repository<DoctorClinic>,
  ) {}

  /**
   * Get the appropriate DoctorClinic repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<DoctorClinic> {
    return manager?.getRepository(DoctorClinic) ?? this.doctorClinicRepository;
  }

  /**
   * Create a doctor-clinic relation.
   */
  async create(payload: CreateDoctorClinicPayload): Promise<DoctorClinicResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const doctorClinic = repository.create({
        doctorId: payload.doctorId,
        clinicId: payload.clinicId,
      });

      const savedDoctorClinic = await repository.save(doctorClinic);

      return {
        doctorClinic: savedDoctorClinic,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'DoctorClinic',
        conflictField: ['doctorId', 'clinicId'],
      });
    }
  }

  /**
   * Find a doctor-clinic relation by Doctor and Clinic ID.
   */
  async findByDoctorAndClinic(payload: FindDoctorClinicByDoctorAndClinicPayload): Promise<DoctorClinicResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorClinic = await repository.findOne({
      where: {
        doctorId: payload.doctorId,
        clinicId: payload.clinicId,
      },
    });

    if (!doctorClinic) {
      throw new NotFoundException({
        message: 'Doctor-clinic relation not found in database.',
        error: 'DoctorClinic Not Found',
      } as BaseException);
    }

    return {
      doctorClinic,
    };
  }

  /**
   * Find all clinics associated with a doctor.
   */
  async findByDoctorId(payload: FindDoctorClinicsByDoctorIdPayload): Promise<DoctorClinicsResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorClinics = await repository.find({
      where: {
        doctorId: payload.doctorId,
      },
    });

    return {
      doctorClinics,
    };
  }

  /**
   * Find all doctors associated with a clinic.
   */
  async findByClinicId(payload: FindDoctorClinicsByClinicIdPayload): Promise<DoctorClinicsResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorClinics = await repository.find({
      where: {
        clinicId: payload.clinicId,
      },
    });

    return {
      doctorClinics,
    };
  }

  /**
   * Delete a doctor-clinic relation.
   */
  async delete(payload: DeleteDoctorClinicPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.softDelete({
        doctorId: payload.doctorId,
        clinicId: payload.clinicId,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Doctor-clinic relation not found in database.',
          error: 'DoctorClinic Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'DoctorClinic',
      });
    }
  }
}
