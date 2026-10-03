import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseException, FindPatientsPayload, PatientsResponse } from '@/types';
import { checkDatabaseError } from '@/lib';
import {
  CreatePatientPayload,
  FindPatientByIdPayload,
  FindPatientByNationalCodePayload,
  FindPatientByUserIdPayload,
  PatientResponse,
  UpdatePatientPayload,
} from '@/types';
import { Patient } from './entities';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  /**
   * Get the appropriate Patient repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Patient> {
    return manager?.getRepository(Patient) ?? this.patientRepository;
  }

  /**
   * Create a new patient profile.
   */
  async create(payload: CreatePatientPayload): Promise<PatientResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const patient = repository.create({
        userId: payload.userId,
        nationalCode: payload.nationalCode,
        birthDate: payload.birthDate,
        gender: payload.gender,
        bloodType: payload.bloodType,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactPhone: payload.emergencyContactPhone,
        address: payload.address,
        city: payload.city,
      });

      const savedPatient = await repository.save(patient);

      return {
        patient: savedPatient,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Patient',
        conflictField: 'nationalCode',
      });
    }
  }

  /**
   * Find all patients.
   */
  async findAll(payload: FindPatientsPayload): Promise<PatientsResponse> {
    const repository = this.getRepository(payload.manager);

    const patients = await repository.find({
      where: payload.gender ? { gender: payload.gender } : undefined,
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      patients,
    };
  }

  /**
   * Find a patient by ID.
   */
  async findById(payload: FindPatientByIdPayload): Promise<PatientResponse> {
    const repository = this.getRepository(payload.manager);

    const patient = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!patient) {
      throw new NotFoundException({
        message: 'Patient not found in database.',
        error: 'Patient Not Found',
      } as BaseException);
    }

    return {
      patient,
    };
  }

  /**
   * Find a patient by user ID.
   */
  async findByUserId(payload: FindPatientByUserIdPayload): Promise<PatientResponse> {
    const repository = this.getRepository(payload.manager);

    const patient = await repository.findOne({
      where: {
        userId: payload.userId,
      },
    });

    if (!patient) {
      throw new NotFoundException({
        message: 'Patient not found in database.',
        error: 'Patient Not Found',
      } as BaseException);
    }

    return {
      patient,
    };
  }

  /**
   * Find a patient by national code.
   */
  async findByNationalCode(payload: FindPatientByNationalCodePayload): Promise<PatientResponse> {
    const repository = this.getRepository(payload.manager);

    const patient = await repository.findOne({
      where: {
        nationalCode: payload.nationalCode,
      },
    });

    if (!patient) {
      throw new NotFoundException({
        message: 'Patient not found in database.',
        error: 'Patient Not Found',
      } as BaseException);
    }

    return {
      patient,
    };
  }

  /**
   * Update a patient profile.
   */
  async update(payload: UpdatePatientPayload): Promise<PatientResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const updatedPatient = await repository.preload({
        id: payload.patientId,
        ...(payload.nationalCode !== undefined && {
          nationalCode: payload.nationalCode,
        }),
        ...(payload.birthDate !== undefined && {
          birthDate: payload.birthDate,
        }),
        ...(payload.gender !== undefined && {
          gender: payload.gender,
        }),
        ...(payload.bloodType !== undefined && {
          bloodType: payload.bloodType,
        }),
        ...(payload.emergencyContactName !== undefined && {
          emergencyContactName: payload.emergencyContactName,
        }),
        ...(payload.emergencyContactPhone !== undefined && {
          emergencyContactPhone: payload.emergencyContactPhone,
        }),
        ...(payload.address !== undefined && {
          address: payload.address,
        }),
        ...(payload.city !== undefined && {
          city: payload.city,
        }),
      });

      if (!updatedPatient) {
        throw new NotFoundException({
          message: 'Patient not found in database.',
          error: 'Patient Not Found',
        } as BaseException);
      }

      const savedPatient = await repository.save(updatedPatient);

      return {
        patient: savedPatient,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Patient',
        conflictField: 'nationalCode',
      });
    }
  }
}
