import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { TimeSlotJob, AppointmentJob } from './jobs';
import { addDays, getServerDate } from '@/lib';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly timeSlotJob: TimeSlotJob,
    private readonly appointmentJob: AppointmentJob,
  ) {}

  /**
   * Generate time slots on application startup.
   */
  @Timeout(5000)
  async generateTimeSlotsOnStartup() {
    const startDate = getServerDate();
    const endDate = addDays(startDate, 6);

    await this.timeSlotJob.ensureTimeSlots({
      startDate,
      endDate,
    });
  }

  /**
   * Generate time slots for the upcoming seven days.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateTimeSlotsDaily() {
    const startDate = getServerDate();
    const endDate = addDays(startDate, 6);

    await this.timeSlotJob.ensureTimeSlots({
      startDate,
      endDate,
    });
  }

  /**
   * Expire past time slots.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async expireTimeSlots() {
    await this.timeSlotJob.expireTimeSlots();
  }

  /**
   * Expire past appointments.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async expireAppointments() {
    await this.appointmentJob.expireAppointments();
  }
}
