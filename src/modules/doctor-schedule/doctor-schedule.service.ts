import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DoctorSchedule } from './entities';
import { checkDatabaseError } from '@/lib';
import {
  BaseException,
  CreateDoctorSchedulePayload,
  DeleteDoctorSchedulePayload,
  DoctorScheduleResponse,
  DoctorSchedulesResponse,
  FindAllDoctorSchedulesPayload,
  FindDoctorScheduleByIdPayload,
  FindDoctorSchedulesPayload,
  UpdateDoctorSchedulePayload,
  UpdateDoctorScheduleStatusPayload,
} from '@/types';

@Injectable()
export class DoctorScheduleService {
  constructor(
    @InjectRepository(DoctorSchedule)
    private readonly doctorScheduleRepository: Repository<DoctorSchedule>,
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
      const schedule = repository.create({
        clinicId: payload.clinicId,
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
      checkDatabaseError({
        e: error as Error,
        mainResource: 'DoctorSchedule',
      });
    }
  }

  /**
   * Get a doctor schedule by ID.
   */
  async getById(payload: FindDoctorScheduleByIdPayload): Promise<DoctorScheduleResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedule = await repository.findOne({
      where: {
        id: payload.id,
        clinicId: payload.clinicId,
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
   * Get all schedules belonging to a clinic.
   */
  async findByClinicId(payload: FindDoctorSchedulesPayload): Promise<DoctorSchedulesResponse> {
    const repository = this.getRepository(payload.manager);

    const doctorSchedules = await repository.find({
      where: {
        clinicId: payload.clinicId,
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
        clinicId: payload.clinicId,
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
        clinicId: payload.clinicId,
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

    const result = await repository.softDelete({
      id: payload.id,
      clinicId: payload.clinicId,
    });

    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Doctor schedule not found in database.',
        error: 'Doctor Schedule Not Found',
      } as BaseException);
    }
  }

  /**
   * Get all doctor schedules
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
