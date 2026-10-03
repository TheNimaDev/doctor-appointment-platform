import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DoctorClinic } from './entities';
import {
  BaseException,
  CreateDoctorClinicPayload,
  DeleteDoctorClinicPayload,
  DoctorClinicResponse,
  DoctorClinicsResponse,
  FindDoctorClinicByDoctorAndClinicPayload,
  FindDoctorClinicsByClinicIdPayload,
  FindAllDoctorClinicsPayload,
  FindClinicDoctorsByOwnerIdPayload,
  FindDoctorClinicsByUserIdPayload,
  FindDoctorClinicByIdPayload,
  FindDoctorClinicsByDoctorIdPayload,
} from '@/types';
import { checkDatabaseError } from '@/lib';
import { DoctorService } from '@/modules/doctor/doctor.service';
import { ClinicService } from '@/modules/clinic/clinic.service';

@Injectable()
export class DoctorClinicService {
  constructor(
    @InjectRepository(DoctorClinic)
    private readonly doctorClinicRepository: Repository<DoctorClinic>,
    private readonly doctorService: DoctorService,
    private readonly clinicService: ClinicService,
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
   * Find a doctor-clinic relation by doctor and clinic IDs.
   */
  async findByDoctorAndClinic(payload: FindDoctorClinicByDoctorAndClinicPayload): Promise<DoctorClinicResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.doctorService.findById({
      id: payload.doctorId,
      manager: payload.manager,
    });

    const { clinic } = await this.clinicService.findById({
      id: payload.clinicId,
      manager: payload.manager,
    });

    const doctorClinic = await repository.findOne({
      where: {
        doctorId: doctor.id,
        clinicId: clinic.id,
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

    const { doctor } = await this.doctorService.findById({
      id: payload.doctorId,
      manager: payload.manager,
    });

    const doctorClinics = await repository.find({
      where: {
        doctorId: doctor.id,
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

    const { clinic } = await this.clinicService.findById({
      id: payload.clinicId,
      manager: payload.manager,
    });

    const doctorClinics = await repository.find({
      where: {
        clinicId: clinic.id,
      },
    });

    return {
      doctorClinics,
    };
  }

  /**
   * Find all doctors associated with a clinic owner.
   */
  async findClinicDoctors(payload: FindClinicDoctorsByOwnerIdPayload): Promise<DoctorClinicsResponse> {
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
   * Find all clinics associated with a doctor's user ID.
   */
  async findDoctorClinics(payload: FindDoctorClinicsByUserIdPayload): Promise<DoctorClinicsResponse> {
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
   * Find a doctor-clinic relation by ID.
   */
  async findById(payload: FindDoctorClinicByIdPayload): Promise<DoctorClinicResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorClinic = await repository.findOne({
      where: {
        id: payload.id,
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
   * Find all doctor-clinic relations.
   */
  async findAll(payload: FindAllDoctorClinicsPayload): Promise<DoctorClinicsResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorClinics = await repository.find();

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
        id: payload.id,
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
