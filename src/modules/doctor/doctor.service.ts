import { Injectable, NotFoundException } from '@nestjs/common';
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
  BaseException,
  ResolveDoctorPayload,
  UpdateDoctorStatusPayload,
} from '@/types';
import { checkDatabaseError } from '@/lib';
import { DoctorStatus } from './enums';

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
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<Doctor> {
    return manager?.getRepository(Doctor) ?? this.doctorRepository;
  }

  /**
   * Create a new doctor profile request.
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
   */
  async findAll(payload: FindDoctorsPayload): Promise<DoctorsResponse> {
    const repository = this.getRepository(payload.manager);

    const status = payload?.status ? payload.status : DoctorStatus.ACTIVE;

    const doctors = await repository.find({
      where: {
        status,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      doctors,
    };
  }

  /**
   * Find an active doctor by ID.
   */
  async findActiveById(payload: FindDoctorByIdPayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    const doctor = await repository.findOne({
      where: {
        id: payload.id,
        status: DoctorStatus.ACTIVE,
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
   * Find a doctor by ID.
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
   */
  async findByUserId(payload: FindDoctorByUserIdPayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    const status = payload?.status ? payload.status : DoctorStatus.ACTIVE;

    const doctor = await repository.findOne({
      where: {
        userId: payload.userId,
        status,
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
   */
  async findByMedicalCode(payload: FindDoctorByMedicalCodePayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    const status = payload?.status ? payload.status : DoctorStatus.ACTIVE;

    const doctor = await repository.findOne({
      where: {
        medicalCode: payload.medicalCode,
        status,
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
   * Update a doctor profile.
   */
  async update(payload: UpdateDoctorPayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { doctor } = await this.resolveDoctor(payload);

      const updatedDoctor = await repository.preload({
        id: doctor.id,
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
      });

      if (!updatedDoctor) {
        throw new NotFoundException({
          message: 'Doctor not found in database.',
          error: 'Doctor Not Found',
        } as BaseException);
      }

      const savedDoctor = await repository.save(updatedDoctor);

      return {
        doctor: savedDoctor,
      };
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
   * Update a doctor profile status.
   */
  async updateStatus(payload: UpdateDoctorStatusPayload): Promise<DoctorResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { doctor } = await this.resolveDoctor(payload);

      const updatedDoctor = await repository.preload({
        id: doctor.id,
        status: payload.status,
      });

      if (!updatedDoctor) {
        throw new NotFoundException({
          message: 'Doctor not found in database.',
          error: 'Doctor Not Found',
        } as BaseException);
      }

      const savedDoctor = await repository.save(updatedDoctor);

      return {
        doctor: savedDoctor,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'Doctor',
      });
    }
  }

  /**
   * Soft-delete a doctor profile.
   */
  async delete(payload: DeleteDoctorPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const { doctor } = await this.resolveDoctor(payload);

      const result = await repository.softDelete({
        id: doctor.id,
      });

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
      });
    }
  }

  /**
   * Resolve a doctor by either user ID or doctor ID.
   */
  async resolveDoctor(payload: ResolveDoctorPayload): Promise<DoctorResponse> {
    if ('userId' in payload) {
      return this.findByUserId({
        userId: payload.userId,
        manager: payload.manager,
      });
    }

    return this.findById({
      id: payload.doctorId,
      manager: payload.manager,
    });
  }
}
