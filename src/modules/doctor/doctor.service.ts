import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Doctor } from './entities';
import {
  CreateDoctorPayload,
  DeleteDoctorPayload,
  DoctorResponse,
  DoctorsResponse,
  FindDoctorByIdPayload,
  FindDoctorByMedicalCodePayload,
  FindDoctorByUserIdPayload,
  FindDoctorsPayload,
  UpdateDoctorPayload,
} from '@/types/doctor.types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  /**
   * Get the appropriate Doctor repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default Doctor repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Doctor> {
    return manager?.getRepository(Doctor) ?? this.doctorRepository;
  }

  /**
   * Create a new doctor profile.
   *
   * - Creates and persists a doctor profile for an existing user.
   * - Handles database constraint errors such as duplicate medical codes
   *   and invalid user references.
   * - Returns the created doctor profile.
   */
  async create(payload: CreateDoctorPayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const doctor = repository.create({
        userId: payload.userId,
        medicalCode: payload.medicalCode,
        bio: payload.bio,
        experienceYears: payload.experienceYears,
        consultationFee: payload.consultationFee,
      });

      const savedDoctor = await repository.save(doctor);

      return {
        doctor: savedDoctor,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Doctor',
        conflictField: 'medicalCode',
      });
    }
  }

  /**
   * Find all doctors.
   *
   * - Returns all available doctor profiles.
   * - Can later be extended with pagination, filtering and sorting.
   */
  async findAll(payload: FindDoctorsPayload): Promise<DoctorsResponse> {
    const repository = this.getRepository(payload.manager);

    const doctors = await repository.find();

    return {
      doctors,
    };
  }

  /**
   * Find a doctor by ID.
   *
   * - Searches for a doctor using its unique ID.
   * - Throws NotFoundException if the doctor does not exist.
   */
  async findById(payload: FindDoctorByIdPayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    const doctor = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!doctor) {
      throw new NotFoundException({
        message: 'Doctor not found in database.',
        error: 'Doctor Not Found',
      } as BaseException);
    }

    return {
      doctor,
    };
  }

  /**
   * Find a doctor by user ID.
   *
   * - Finds the doctor profile associated with a user.
   * - Each user can have only one doctor profile.
   * - Throws NotFoundException if the doctor does not exist.
   */
  async findByUserId(payload: FindDoctorByUserIdPayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    const doctor = await repository.findOne({
      where: {
        userId: payload.userId,
      },
    });

    if (!doctor) {
      throw new NotFoundException({
        message: 'Doctor not found in database.',
        error: 'Doctor Not Found',
      } as BaseException);
    }

    return {
      doctor,
    };
  }

  /**
   * Find a doctor by medical code.
   *
   * - Searches for a doctor using their medical code.
   * - Used for medical code lookup and verification workflows.
   * - Throws NotFoundException if the doctor does not exist.
   */
  async findByMedicalCode(payload: FindDoctorByMedicalCodePayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    const doctor = await repository.findOne({
      where: {
        medicalCode: payload.medicalCode,
      },
    });

    if (!doctor) {
      throw new NotFoundException({
        message: 'Doctor not found in database.',
        error: 'Doctor Not Found',
      } as BaseException);
    }

    return {
      doctor,
    };
  }

  /**
   * Update an existing doctor profile.
   *
   * - Updates only the provided doctor profile fields.
   * - Sensitive fields such as status and rating data
   *   are handled by dedicated business methods.
   * - Throws NotFoundException if the doctor does not exist.
   */
  async update(payload: UpdateDoctorPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.update(
        { id: payload.id },
        {
          ...(payload.medicalCode !== undefined && {
            medicalCode: payload.medicalCode,
          }),
          ...(payload.bio !== undefined && {
            bio: payload.bio,
          }),
          ...(payload.experienceYears !== undefined && {
            experienceYears: payload.experienceYears,
          }),
          ...(payload.consultationFee !== undefined && {
            consultationFee: payload.consultationFee,
          }),
        },
      );

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Doctor not found in database.',
          error: 'Doctor Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Doctor',
        conflictField: 'medicalCode',
      });
    }
  }

  /**
   * Soft-delete a doctor profile.
   *
   * - Marks the doctor as deleted instead of permanently removing it.
   * - Preserves the doctor record for auditing or recovery.
   */
  async delete(payload: DeleteDoctorPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.findById({
      id: payload.id,
      manager: payload.manager,
    });

    await repository.softRemove(doctor);
  }
}
