import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TimeSlotJob } from './jobs';
import { addDays, getServerDate } from '@/lib';

@Injectable()
export class SchedulerService {
  constructor(private readonly timeSlotJob: TimeSlotJob) {}

  /**
   * Generate time slots for the upcoming seven days.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateTimeSlots() {
    const startDate = getServerDate();
    const endDate = addDays(startDate, 6);

    await this.timeSlotJob.ensureTimeSlots({
      startDate,
      endDate,
    });
  }
}
