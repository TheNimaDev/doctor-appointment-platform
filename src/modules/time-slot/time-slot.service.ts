import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TimeSlot } from './entities';
import { TimeSlotStatus } from './enums';
import { TIME_SLOT_ALLOWED_TRANSITIONS } from './constants';
import { DatabaseService } from '@/modules/database/database.service';
import { DoctorService } from '@/modules/doctor/doctor.service';
import {
  BaseException,
  CreateTimeSlotPayload,
  DeleteTimeSlotPayload,
  FindAvailableByClinicPayload,
  FindAvailableByDoctorAndClinicPayload,
  FindAvailableByDoctorPayload,
  FindMyByClinicTimeSlotsPayload,
  FindMyClinicDoctorTimeSlotsPayload,
  FindMyClinicTimeSlotsPayload,
  FindMyTimeSlotsPayload,
  FindTimeSlotByIdPayload,
  GetMyClinicTimeSlotPayload,
  TimeSlotResponse,
  TimeSlotsResponse,
  UpdateTimeSlotStatusHandlerPayload,
  UpdateTimeSlotStatusPayload,
} from '@/types';
import { checkDatabaseError, isDateTimeExpired } from '@/lib';
import { DoctorClinicService } from '../doctor-clinic/doctor-clinic.service';
import { ClinicService } from '../clinic/clinic.service';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,

    private readonly databaseService: DatabaseService,
    private readonly doctorService: DoctorService,
    private readonly doctorClinicService: DoctorClinicService,
    private readonly clinicService: ClinicService,
  ) {}

  /**
   * Get the appropriate TimeSlot repository.
   *
   * - Uses the transaction manager repository when provided.
   * - Falls back to the default repository otherwise.
   */
  private getRepository(manager?: EntityManager): Repository<TimeSlot> {
    return manager?.getRepository(TimeSlot) ?? this.timeSlotRepository;
  }

  /**
   * Create a new time slot.
   */
  async createTimeSlot(payload: CreateTimeSlotPayload): Promise<TimeSlotResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const timeSlot = repository.create({
        ...payload,
        status: payload.status ?? TimeSlotStatus.AVAILABLE,
      });

      const savedTimeSlot = await repository.save(timeSlot);

      return {
        timeSlot: savedTimeSlot,
      };
    } catch (error) {
      checkDatabaseError({
        e: error as Error,
        mainResource: 'TimeSlot',
      });
    }
  }

  /**
   * Get a time slot by ID.
   */
  async getById(payload: FindTimeSlotByIdPayload): Promise<TimeSlotResponse> {
    const repository = this.getRepository(payload.manager);

    const timeSlot = await repository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!timeSlot) {
      throw new NotFoundException({
        message: 'Time slot not found in database.',
        error: 'Time Slot Not Found',
      } as BaseException);
    }

    return {
      timeSlot,
    };
  }

  /**
   * Get available time slots for a doctor.
   */
  async findAvailableByDoctor(payload: FindAvailableByDoctorPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.doctorService.findById({
      id: payload.doctorId,
      manager: payload.manager,
    });

    const timeSlots = await repository.find({
      where: {
        schedule: {
          doctorClinic: {
            doctorId: doctor.id,
          },
        },
        ...(payload.date && {
          date: payload.date,
        }),
        status: TimeSlotStatus.AVAILABLE,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Get available time slots for a doctor in a specific clinic.
   */
  async findAvailableByDoctorAndClinic(payload: FindAvailableByDoctorAndClinicPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.doctorService.findById({
      id: payload.doctorId,
      manager: payload.manager,
    });
    const { clinic } = await this.clinicService.findById({
      id: payload.clinicId,
      manager: payload.manager,
    });
    const { doctorClinic } = await this.doctorClinicService.findByDoctorAndClinic({
      clinicId: clinic.id,
      doctorId: doctor.id,
      manager: payload.manager,
    });

    const timeSlots = await repository.find({
      where: {
        schedule: {
          doctorClinicId: doctorClinic.id,
        },
        ...(payload.date && {
          date: payload.date,
        }),
        status: TimeSlotStatus.AVAILABLE,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Get available time slots for a clinic.
   *
   * Public route.
   */
  async findAvailableByClinic(payload: FindAvailableByClinicPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const { clinic } = await this.clinicService.findById({
      id: payload.clinicId,
      manager: payload.manager,
    });

    const timeSlots = await repository.find({
      where: {
        schedule: {
          doctorClinic: {
            clinicId: clinic.id,
          },
        },
        ...(payload.date && {
          date: payload.date,
        }),
        status: TimeSlotStatus.AVAILABLE,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Get all time slots belonging to the authenticated doctor.
   */
  async findMy(payload: FindMyTimeSlotsPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.doctorService.resolveDoctor({
      userId: payload.userId,
      manager: payload.manager,
    });

    const timeSlots = await repository.find({
      where: {
        schedule: {
          doctorClinic: {
            doctorId: doctor.id,
          },
        },
        ...(payload.date && {
          date: payload.date,
        }),
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Get the authenticated doctor's time slots in a specific clinic.
   */
  async findMyByClinic(payload: FindMyByClinicTimeSlotsPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctor } = await this.doctorService.resolveDoctor({
      userId: payload.userId,
      manager: payload.manager,
    });

    const { clinic } = await this.clinicService.findById({
      id: payload.clinicId,
      manager: payload.manager,
    });
    const { doctorClinic } = await this.doctorClinicService.findByDoctorAndClinic({
      clinicId: clinic.id,
      doctorId: doctor.id,
      manager: payload.manager,
    });

    const timeSlots = await repository.find({
      where: {
        schedule: {
          doctorClinicId: doctorClinic.id,
        },
        ...(payload.date && {
          date: payload.date,
        }),
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Get all time slots in the authenticated admin's clinic.
   */
  async findMyClinic(payload: FindMyClinicTimeSlotsPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const { clinic } = await this.clinicService.findByOwnerId({
      ownerId: payload.userId,
      manager: payload.manager,
    });

    const timeSlots = await repository.find({
      where: {
        schedule: {
          doctorClinic: {
            clinicId: clinic.id,
          },
        },
        ...(payload.date && {
          date: payload.date,
        }),
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Get a specific doctor's time slots in the authenticated admin's clinic.
   */
  async findMyClinicDoctor(payload: FindMyClinicDoctorTimeSlotsPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const { clinic } = await this.clinicService.findByOwnerId({
      ownerId: payload.userId,
      manager: payload.manager,
    });

    const { doctorClinic } = await this.doctorClinicService.findByDoctorAndClinic({
      clinicId: clinic.id,
      doctorId: payload.doctorId,
      manager: payload.manager,
    });

    const timeSlots = await repository.find({
      where: {
        schedule: {
          doctorClinicId: doctorClinic.id,
        },
        ...(payload.date && {
          date: payload.date,
        }),
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Get a specific time slot from the authenticated admin's clinic.
   */
  async getMyClinicTimeSlot(payload: GetMyClinicTimeSlotPayload): Promise<TimeSlotResponse> {
    const repository = this.getRepository(payload.manager);

    const { clinic } = await this.clinicService.findByOwnerId({
      ownerId: payload.userId,
      manager: payload.manager,
    });

    const timeSlot = await repository.findOne({
      where: {
        id: payload.id,
        schedule: {
          doctorClinic: {
            clinicId: clinic.id,
          },
        },
      },
    });

    if (!timeSlot) {
      throw new NotFoundException({
        message: 'Time slot not found in your clinic.',
        error: 'Time Slot Not Found',
      } as BaseException);
    }

    return {
      timeSlot,
    };
  }

  /**
   * Update a time slot's status within a transaction.
   */
  async updateStatusHandler(payload: UpdateTimeSlotStatusHandlerPayload): Promise<TimeSlotResponse> {
    return await this.databaseService.dataSource.transaction(async (manager) => {
      return await this.updateStatus({ ...payload, manager });
    });
  }

  /**
   * Update a time slot's status.
   */
  async updateStatus(payload: UpdateTimeSlotStatusPayload): Promise<TimeSlotResponse> {
    const repository = this.getRepository(payload.manager);

    try {
      const query = repository.createQueryBuilder('timeSlot').where('timeSlot.id = :id', {
        id: payload.id,
      });

      const timeSlot = await query.setLock('pessimistic_write').getOne();

      if (!timeSlot) {
        throw new NotFoundException({
          message: 'Time slot not found in database.',
          error: 'Time Slot Not Found',
        } as BaseException);
      }

      const allowed = TIME_SLOT_ALLOWED_TRANSITIONS[timeSlot.status];

      if (payload.status !== TimeSlotStatus.EXPIRED && isDateTimeExpired(timeSlot.date, timeSlot.endTime)) {
        throw new BadRequestException({
          message: `Cannot update an expired time slot to ${payload.status}.`,
          error: 'Time Slot Expired',
        } as BaseException);
      }

      if (!allowed.includes(payload.status)) {
        throw new BadRequestException({
          message: `Cannot change time slot status from ${timeSlot.status} to ${payload.status}.`,
          error: 'Invalid Time Slot Status Transition',
        } as BaseException);
      }

      timeSlot.status = payload.status;

      const updatedTimeSlot = await repository.save(timeSlot);

      return {
        timeSlot: updatedTimeSlot,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      checkDatabaseError({
        e: error as Error,
        mainResource: 'TimeSlot',
      });
    }
  }

  /**
   * Soft-delete a time slot.
   */
  async deleteTimeSlot(payload: DeleteTimeSlotPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    const result = await repository.softDelete({
      id: payload.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException({
        message: 'Time slot not found in database.',
        error: 'Time Slot Not Found',
      } as BaseException);
    }
  }
}
