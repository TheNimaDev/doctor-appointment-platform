import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DoctorSpecialty } from './entities';
import {
  AddDoctorSpecialtyPayload,
  DoctorSpecialtiesResponse,
  DoctorSpecialtyResponse,
  FindDoctorSpecialtiesByUserIdPayload,
  FindDoctorSpecialtiesPayload,
  FindDoctorSpecialtyPayload,
  RemoveDoctorSpecialtyPayload,
  SetPrimaryDoctorSpecialtyPayload,
} from '@/types/doctor-specialty.types';
import { BaseException } from '@/types';
import { checkDatabaseError } from '@/lib';
import { DoctorService } from '@/modules/doctor/doctor.service';
import { SpecialtyService } from '@/modules/specialty/specialty.service';

@Injectable()
export class DoctorSpecialtyService {
  constructor(
    @InjectRepository(DoctorSpecialty)
    private readonly doctorSpecialtyRepository: Repository<DoctorSpecialty>,
    private readonly doctorService: DoctorService,
    private readonly specialtyService: SpecialtyService,
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
      const { specialty } = await this.specialtyService.getById({
        id: payload.specialtyId,
        manager: payload.manager,
      });

      const doctorSpecialty = repository.create({
        doctorId: payload.doctorId,
        specialtyId: specialty.id,
      });

      const hasSpecialty = await repository.exists({
        where: {
          doctorId: payload.doctorId,
        },
      });

      const isPrimary = !hasSpecialty || (payload.isPrimary ?? false);
      if (isPrimary) {
        await repository.update(
          {
            doctorId: payload.doctorId,
          },
          {
            isPrimary: false,
          },
        );

        doctorSpecialty.isPrimary = true;
      }

      const savedDoctorSpecialty = await repository.save(doctorSpecialty);

      return {
        doctorSpecialty: savedDoctorSpecialty,
      };
    } catch (error) {
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

    const { doctor } = await this.doctorService.findById({
      id: payload.doctorId,
      manager: payload.manager,
    });

    const doctorSpecialties = await repository.find({
      where: {
        doctorId: doctor.id,
      },
    });

    return {
      doctorSpecialties,
    };
  }

  /**
   * Find a specific doctor-specialty relation.
   */
  async getById(payload: FindDoctorSpecialtyPayload): Promise<DoctorSpecialtyResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSpecialty = await repository.findOne({
      where: {
        id: payload.id,
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
          id: payload.id,
        },
        {
          isPrimary: true,
        },
      );

      return this.getById({
        id: payload.id,
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
   * Find all specialties assigned to a doctor by user ID.
   */
  async findAllByUserId(payload: FindDoctorSpecialtiesByUserIdPayload): Promise<DoctorSpecialtiesResponse> {
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
   * Soft-delete a specialty from a doctor.
   */
  async remove(payload: RemoveDoctorSpecialtyPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    try {
      const result = await repository.softDelete({
        id: payload.id,
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
