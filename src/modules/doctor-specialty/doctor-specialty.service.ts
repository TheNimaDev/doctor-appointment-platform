import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DoctorSpecialty } from './entities';
import {
  AddDoctorSpecialtyPayload,
  DoctorSpecialtiesResponse,
  DoctorSpecialtyResponse,
  FindDoctorSpecialtiesPayload,
  FindDoctorSpecialtyPayload,
  RemoveDoctorSpecialtyPayload,
  SetPrimaryDoctorSpecialtyPayload,
} from '@/types/doctor-specialty.types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';
import { Doctor } from '@/modules/doctor/entities';
import { Specialty } from '@/modules/specialty/entities';

@Injectable()
export class DoctorSpecialtyService {
  constructor(
    @InjectRepository(DoctorSpecialty)
    private readonly doctorSpecialtyRepository: Repository<DoctorSpecialty>,
  ) {}

  /**
   * Get the appropriate DoctorSpecialty repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<DoctorSpecialty> {
    return manager?.getRepository(DoctorSpecialty) ?? this.doctorSpecialtyRepository;
  }

  /**
   * Add a specialty to a doctor.
   */
  async add(payload: AddDoctorSpecialtyPayload): Promise<DoctorSpecialtyResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const doctorRepository =
        payload.manager?.getRepository(Doctor) ?? this.doctorSpecialtyRepository.manager.getRepository(Doctor);

      const specialtyRepository =
        payload.manager?.getRepository(Specialty) ?? this.doctorSpecialtyRepository.manager.getRepository(Specialty);

      const doctor = await doctorRepository.findOne({
        where: {
          id: payload.doctorId,
        },
      });

      if (!doctor) {
        throw new NotFoundException({
          message: 'Doctor not found in database.',
          error: 'Doctor Not Found',
        } as BaseException);
      }

      const specialty = await specialtyRepository.findOne({
        where: {
          id: payload.specialtyId,
        },
      });

      if (!specialty) {
        throw new NotFoundException({
          message: 'Specialty not found in database.',
          error: 'Specialty Not Found',
        } as BaseException);
      }

      const existing = await repository.findOne({
        where: {
          doctorId: payload.doctorId,
          specialtyId: payload.specialtyId,
        },
      });

      if (existing) {
        throw new ConflictException({
          message: 'This specialty is already assigned to the doctor.',
          error: 'Doctor Specialty Already Exists',
        } as BaseException);
      }

      if (payload.isPrimary) {
        await repository.update(
          {
            doctorId: payload.doctorId,
          },
          {
            isPrimary: false,
          },
        );
      }

      const doctorSpecialty = repository.create({
        doctorId: payload.doctorId,
        specialtyId: payload.specialtyId,
        isPrimary: payload.isPrimary ?? false,
      });

      const savedDoctorSpecialty = await repository.save(doctorSpecialty);

      return {
        doctorSpecialty: savedDoctorSpecialty,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Doctor Specialty',
      });
    }
  }

  /**
   * Find all specialties assigned to a doctor.
   */
  async findAll(payload: FindDoctorSpecialtiesPayload): Promise<DoctorSpecialtiesResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSpecialties = await repository.find({
      where: {
        doctorId: payload.doctorId,
      },
    });

    return {
      doctorSpecialties,
    };
  }

  /**
   * Find a specific doctor-specialty relation.
   */
  async findOne(payload: FindDoctorSpecialtyPayload): Promise<DoctorSpecialtyResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSpecialty = await repository.findOne({
      where: {
        doctorId: payload.doctorId,
        specialtyId: payload.specialtyId,
      },
    });

    if (!doctorSpecialty) {
      throw new NotFoundException({
        message: 'Doctor specialty relation not found in database.',
        error: 'Doctor Specialty Not Found',
      } as BaseException);
    }

    return {
      doctorSpecialty,
    };
  }

  /**
   * Set a doctor's specialty as primary.
   */
  async setPrimary(payload: SetPrimaryDoctorSpecialtyPayload): Promise<DoctorSpecialtyResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      await this.findOne({
        doctorId: payload.doctorId,
        specialtyId: payload.specialtyId,
        manager: payload.manager,
      });

      await repository.update(
        {
          doctorId: payload.doctorId,
        },
        {
          isPrimary: false,
        },
      );

      await repository.update(
        {
          doctorId: payload.doctorId,
          specialtyId: payload.specialtyId,
        },
        {
          isPrimary: true,
        },
      );

      return this.findOne({
        doctorId: payload.doctorId,
        specialtyId: payload.specialtyId,
        manager: payload.manager,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Doctor Specialty',
      });
    }
  }

  /**
   * Soft-delete a specialty from a doctor.
   */
  async remove(payload: RemoveDoctorSpecialtyPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.softDelete({
        doctorId: payload.doctorId,
        specialtyId: payload.specialtyId,
      });

      if (result.affected === 0) {
        throw new NotFoundException({
          message: 'Doctor specialty relation not found in database.',
          error: 'Doctor Specialty Not Found',
        } as BaseException);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'Doctor Specialty',
      });
    }
  }
}
