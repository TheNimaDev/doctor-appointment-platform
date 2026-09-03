import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TimeSlot } from './entities';
import { TimeSlotStatus } from './enums';
import { checkDatabaseError, getServerTime } from '@/lib';
import {
  BaseException,
  CreateTimeSlotPayload,
  DeleteTimeSlotPayload,
  FindAvailableTimeSlotsPayload,
  FindTimeSlotByIdPayload,
  FindTimeSlotsByDoctorAndDatePayload,
  TimeSlotResponse,
  TimeSlotsResponse,
  UpdateTimeSlotStatusPayload,
} from '@/types';
import { TIME_SLOT_ALLOWED_TRANSITIONS } from './constants';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,
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
   *
   * This method is intended to be used internally by the
   * time-slot generation process.
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
   * Get all time slots for a doctor on a specific date.
   */
  async findByDoctorAndDate(payload: FindTimeSlotsByDoctorAndDatePayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const timeSlots = await repository.find({
      where: {
        doctorId: payload.doctorId,
        date: payload.date,
      },
      order: {
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Get all available time slots for a doctor on a specific date.
   */
  async findAvailable(payload: FindAvailableTimeSlotsPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const timeSlots = await repository.find({
      where: {
        doctorId: payload.doctorId,
        date: payload.date,
        status: TimeSlotStatus.AVAILABLE,
      },
      order: {
        startTime: 'ASC',
      },
    });

    return {
      timeSlots,
    };
  }

  /**
   * Update a time slot's status.
   */
  async updateStatus(payload: UpdateTimeSlotStatusPayload): Promise<TimeSlotResponse> {
    const repository = this.getRepository(payload.manager);

    try {
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

      const allowed = TIME_SLOT_ALLOWED_TRANSITIONS[timeSlot.status];

      if (payload.status !== TimeSlotStatus.EXPIRED && timeSlot.endTime <= getServerTime()) {
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
