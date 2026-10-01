import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TimeSlot } from './entities';
import { TimeSlotStatus } from './enums';
import { TIME_SLOT_ALLOWED_TRANSITIONS } from './constants';
import {
  BaseException,
  TimeSlotResponse,
  TimeSlotsResponse,
  GenerateTimeSlotsPayload,
  EnsureTimeSlotsPayload,
  CreateTimeSlotPayload,
  FindTimeSlotsByClinicOrDoctorPayload,
  FindTimeSlotsByClinicAndDoctorPayload,
  GetTimeSlotByIdPayload,
  UpdateTimeSlotStatusHandlerPayload,
  UpdateTimeSlotStatusPayload,
  DeleteTimeSlotPayload,
} from '@/types';
import {
  addDays,
  checkDatabaseError,
  combineDateAndTime,
  getDayOfWeek,
  getServerDate,
  getServerTime,
  isDateTimeExpired,
  minutesToTime,
  timeToMinutes,
} from '@/lib';
import { DatabaseService } from '@/modules/database/database.service';
import { DoctorService } from '@/modules/doctor/doctor.service';
import { DoctorClinicService } from '@/modules/doctor-clinic/doctor-clinic.service';
import { ClinicService } from '@/modules/clinic/clinic.service';
import { DoctorScheduleService } from '@/modules/doctor-schedule/doctor-schedule.service';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,

    private readonly databaseService: DatabaseService,
    private readonly doctorService: DoctorService,
    private readonly doctorClinicService: DoctorClinicService,
    private readonly clinicService: ClinicService,
    private readonly doctorScheduleService: DoctorScheduleService,
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
   * Generate time slots for a specific date.
   */
  private generateSlots(payload: GenerateTimeSlotsPayload) {
    const { date, doctorSchedule: schedule } = payload;

    const slots: Array<{
      date: string;
      startTime: string;
      endTime: string;
    }> = [];

    let currentMinutes = timeToMinutes(schedule.startTime);

    const endMinutes = timeToMinutes(schedule.endTime);

    while (currentMinutes + schedule.slotDuration <= endMinutes) {
      const slotStart = minutesToTime(currentMinutes);

      const slotEnd = minutesToTime(currentMinutes + schedule.slotDuration);

      slots.push({
        date,
        startTime: slotStart,
        endTime: slotEnd,
      });

      currentMinutes += schedule.slotDuration;
    }

    return slots;
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
   * Ensure time slots exist for the doctor.
   */
  async ensureSlots(payload: EnsureTimeSlotsPayload): Promise<void> {
    const repository = this.getRepository(payload.manager);

    const { doctorSchedules } = await this.doctorScheduleService.findActiveByDoctor({
      doctorId: payload.doctorId,
    });

    let currentDate = payload.startDate;

    while (currentDate <= payload.endDate) {
      const currentDateTime = combineDateAndTime(currentDate, '00:00:00');

      const dayOfWeek = getDayOfWeek(currentDateTime);

      const matchingSchedules = doctorSchedules.filter((schedule) => schedule.dayOfWeek === dayOfWeek);

      for (const schedule of matchingSchedules) {
        const existingSlots = await repository.find({
          where: {
            scheduleId: schedule.id,
            date: currentDate,
          },
        });

        const existingStartTimes = new Set(existingSlots.map((slot) => slot.startTime));

        const slots = this.generateSlots({
          date: currentDate,
          doctorSchedule: schedule,
        });

        for (const slot of slots) {
          if (existingStartTimes.has(slot.startTime)) {
            continue;
          }

          await this.createTimeSlot({
            scheduleId: schedule.id,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: TimeSlotStatus.AVAILABLE,
            manager: payload.manager,
          });
        }
      }

      currentDate = addDays(currentDate, 1);
    }
  }

  /**
   * Get a time slot by ID.
   */
  async getById(payload: GetTimeSlotByIdPayload): Promise<TimeSlotResponse> {
    const repository = this.getRepository(payload.manager);

    const timeSlot = await repository.findOne({
      where: {
        id: payload.id,
        ...(payload.status && {
          status: payload.status,
        }),
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
   * Find all time slots belonging to the clinic and doctor.
   */
  async findByClinicAndDoctor(payload: FindTimeSlotsByClinicAndDoctorPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    const { doctorClinic } = await this.doctorClinicService.findByDoctorAndClinic({
      clinicId: payload.clinicId,
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
        ...(payload.status && {
          status: payload.status,
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
   * Find all time slots belonging to the clinic or doctor.
   */
  async findByClinicOrDoctor(payload: FindTimeSlotsByClinicOrDoctorPayload): Promise<TimeSlotsResponse> {
    const repository = this.getRepository(payload.manager);

    if (payload.doctorId) {
      await this.doctorService.findById({
        id: payload.doctorId,
        manager: payload.manager,
      });
    } else if (payload.clinicId) {
      await this.clinicService.findById({
        id: payload.clinicId,
        manager: payload.manager,
      });
    }

    const timeSlots = await repository.find({
      where: {
        schedule: {
          doctorClinic: {
            ...(payload.doctorId && {
              doctorId: payload.doctorId,
            }),
            ...(payload.clinicId && {
              clinicId: payload.clinicId,
            }),
          },
        },
        ...(payload.date && {
          date: payload.date,
        }),
        ...(payload.status && {
          status: payload.status,
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

  /**
   * Expire past time slots.
   */
  async expireTimeSlots(): Promise<void> {
    const repository = this.getRepository();

    const currentDate = getServerDate();
    const currentTime = getServerTime();

    await repository
      .createQueryBuilder()
      .update(TimeSlot)
      .set({
        status: TimeSlotStatus.EXPIRED,
      })
      .where('status != :expiredStatus', {
        expiredStatus: TimeSlotStatus.EXPIRED,
      })
      .andWhere('(date < :currentDate OR (date = :currentDate AND startTime <= :currentTime))', {
        currentDate,
        currentTime,
      })
      .execute();
  }
}
