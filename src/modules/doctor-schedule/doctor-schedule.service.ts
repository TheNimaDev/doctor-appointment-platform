import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { DoctorSchedule } from './entities';
import { checkDatabaseError } from '@/lib';
import {
  BaseException,
  CreateDoctorSchedulePayload,
  DeleteDoctorSchedulePayload,
  DoctorScheduleResponse,
  DoctorSchedulesResponse,
  FindActiveClinicSchedulesPayload,
  FindActiveDoctorClinicSchedulesPayload,
  FindActiveDoctorScheduleByIdPayload,
  FindActiveDoctorSchedulesPayload,
  FindAllDoctorSchedulesPayload,
  FindClinicSchedulesPayload,
  FindDoctorClinicSchedulesPayload,
  FindDoctorScheduleByIdPayload,
  FindDoctorSchedulesPayload,
  UpdateDoctorSchedulePayload,
  UpdateDoctorScheduleStatusPayload,
} from '@/types';
import { DoctorClinicService } from '@/modules/doctor-clinic/doctor-clinic.service';
import { DoctorService } from '@/modules/doctor/doctor.service';
import { ClinicService } from '@/modules/clinic/clinic.service';
import { ScheduleStatus } from './enums';

@Injectable()
export class DoctorScheduleService {
  constructor(
    @InjectRepository(DoctorSchedule)
    private readonly doctorScheduleRepository: Repository<DoctorSchedule>,

    private readonly doctorClinicService: DoctorClinicService,
    private readonly doctorService: DoctorService,
    private readonly clinicService: ClinicService,
  ) {}

  /**
   * Get the appropriate DoctorSchedule repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<DoctorSchedule> {
    return manager?.getRepository(DoctorSchedule) ?? this.doctorScheduleRepository;
  }

  /**
   * Create a new doctor schedule.
   */
  async createDoctorSchedule(payload: CreateDoctorSchedulePayload): Promise<DoctorScheduleResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const { doctorClinic } = await this.doctorClinicService.findByDoctorAndClinic({
        clinicId: payload.clinicId,
        doctorId: payload.doctorId,
        manager: payload.manager,
      });

      const schedule = repository.create({
        doctorClinicId: doctorClinic.id,
        dayOfWeek: payload.dayOfWeek,
        startTime: payload.startTime,
        endTime: payload.endTime,
        slotDuration: payload.slotDuration,
      });

      const savedSchedule = await repository.save(schedule);

      return {
        doctorSchedule: savedSchedule,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'DoctorSchedule',
        conflictField: ['doctorClinicId', 'dayOfWeek', 'startTime', 'endTime'],
      });
    }
  }

  /**
   * Get a doctor active schedule by ID.
   */
  async getActiveById(payload: FindActiveDoctorScheduleByIdPayload): Promise<DoctorScheduleResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedule = await repository.findOne({
      where: {
        id: payload.id,
        status: ScheduleStatus.ACTIVE,
      },
    });

    if (!doctorSchedule) {
      throw new NotFoundException({
        message: 'Doctor schedule not found in database.',
        error: 'Doctor Schedule Not Found',
      } as BaseException);
    }

    return {
      doctorSchedule,
    };
  }

  /**
   * Get a doctor schedule by ID.
   */
  async getById(payload: FindDoctorScheduleByIdPayload): Promise<DoctorScheduleResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedule = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!doctorSchedule) {
      throw new NotFoundException({
        message: 'Doctor schedule not found in database.',
        error: 'Doctor Schedule Not Found',
      } as BaseException);
    }

    return {
      doctorSchedule,
    };
  }

  /**
   * Get all active schedules belonging to a clinic.
   */
  async findActiveByClinic(payload: FindActiveClinicSchedulesPayload): Promise<DoctorSchedulesResponse> {
    const repository = this.getRepository(payload.manager);

    const { clinic } = await this.clinicService.findById({
      id: payload.clinicId,
      manager: payload.manager,
    });

    const { doctorClinics } = await this.doctorClinicService.findByClinicId({
      clinicId: clinic.id,
      manager: payload.manager,
    });

    const doctorSchedules = await repository.find({
      where: {
        doctorClinicId: In(doctorClinics.map((doctorClinic) => doctorClinic.id)),
        status: ScheduleStatus.ACTIVE,
      },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      doctorSchedules,
    };
  }

  /**
   * Get all schedules belonging to a clinic.
   */
  async findByClinic(payload: FindClinicSchedulesPayload): Promise<DoctorSchedulesResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedules = await repository.find({
      where: {
        doctorClinic: {
          clinicId: payload.clinicId,
        },
      },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });
    return {
      doctorSchedules,
    };
  }

  /**
   * Get all active schedules belonging to a doctor.
   */
  async findActiveByDoctor(payload: FindActiveDoctorSchedulesPayload): Promise<DoctorSchedulesResponse> {
    const repository = this.getRepository(payload.manager);

    await this.doctorService.findById({
      id: payload.doctorId,
      manager: payload.manager,
    });

    const doctorSchedules = await repository.find({
      where: {
        doctorClinic: {
          doctorId: payload.doctorId,
        },
        status: ScheduleStatus.ACTIVE,
      },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      doctorSchedules,
    };
  }

  /**
   * Get all schedules belonging to a doctor.
   */
  async findByDoctor(payload: FindDoctorSchedulesPayload): Promise<DoctorSchedulesResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedules = await repository.find({
      where: {
        doctorClinic: {
          doctorId: payload.doctorId,
        },
      },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      doctorSchedules,
    };
  }

  /**
   * Get all active schedules belonging to a doctor-clinic relation.
   */
  async findActiveByDoctorAndClinic(payload: FindActiveDoctorClinicSchedulesPayload): Promise<DoctorSchedulesResponse> {
    const repository = this.getRepository(payload.manager);

    await this.doctorService.findById({
      id: payload.doctorId,
      manager: payload.manager,
    });

    await this.clinicService.findById({
      id: payload.clinicId,
      manager: payload.manager,
    });

    const { doctorClinic } = await this.doctorClinicService.findByDoctorAndClinic({
      clinicId: payload.clinicId,
      doctorId: payload.doctorId,
      manager: payload.manager,
    });

    const doctorSchedules = await repository.find({
      where: {
        doctorClinicId: doctorClinic.id,
        status: ScheduleStatus.ACTIVE,
      },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      doctorSchedules,
    };
  }

  /**
   * Get all schedules belonging to a doctor-clinic relation.
   */
  async findByDoctorAndClinic(payload: FindDoctorClinicSchedulesPayload): Promise<DoctorSchedulesResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedules = await repository.find({
      where: {
        doctorClinic: {
          doctorId: payload.doctorId,
          clinicId: payload.clinicId,
        },
      },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      doctorSchedules,
    };
  }

  /**
   * Update a doctor schedule.
   */
  async updateDoctorSchedule(payload: UpdateDoctorSchedulePayload): Promise<DoctorScheduleResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const doctorSchedule = await repository.preload({
        id: payload.id,
        ...(payload.dayOfWeek !== undefined && {
          dayOfWeek: payload.dayOfWeek,
        }),
        ...(payload.startTime !== undefined && {
          startTime: payload.startTime,
        }),
        ...(payload.endTime !== undefined && {
          endTime: payload.endTime,
        }),
        ...(payload.slotDuration !== undefined && {
          slotDuration: payload.slotDuration,
        }),
      });

      if (!doctorSchedule) {
        throw new NotFoundException({
          message: 'Doctor schedule not found in database.',
          error: 'Doctor Schedule Not Found',
        } as BaseException);
      }

      const updatedSchedule = await repository.save(doctorSchedule);

      return {
        doctorSchedule: updatedSchedule,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'DoctorSchedule',
      });
    }
  }

  /**
   * Update a doctor schedule's status.
   */
  async updateDoctorScheduleStatus(payload: UpdateDoctorScheduleStatusPayload): Promise<DoctorScheduleResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const doctorSchedule = await repository.preload({
        id: payload.id,
        status: payload.status,
      });

      if (!doctorSchedule) {
        throw new NotFoundException({
          message: 'Doctor schedule not found in database.',
          error: 'Doctor Schedule Not Found',
        } as BaseException);
      }

      const updatedSchedule = await repository.save(doctorSchedule);

      return {
        doctorSchedule: updatedSchedule,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'DoctorSchedule',
      });
    }
  }

  /**
   * Soft-delete a doctor schedule.
   */
  async deleteDoctorSchedule(payload: DeleteDoctorSchedulePayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedule = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!doctorSchedule) {
      throw new NotFoundException({
        message: 'Doctor schedule not found in database.',
        error: 'Doctor Schedule Not Found',
      } as BaseException);
    }

    await repository.softRemove(doctorSchedule);
  }

  /**
   * Get all doctor schedules.
   */
  async findAll(payload: FindAllDoctorSchedulesPayload): Promise<DoctorSchedulesResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedules = await repository.find({
      where: {
        ...(payload.status !== undefined && {
          status: payload.status,
        }),
      },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      doctorSchedules,
    };
  }
}
