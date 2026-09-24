import { DoctorService } from '@/modules/doctor/doctor.service';
import { TimeSlotService } from '@/modules/time-slot/time-slot.service';
import { CreateTimeSlotJobPayload } from '@/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeSlotJob {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly timeSlotService: TimeSlotService,
  ) {}

  /**
   * Ensure time slots exist for all doctors within the given date range.
   */
  async ensureTimeSlots(payload: CreateTimeSlotJobPayload) {
    const { startDate, endDate } = payload;

    const { doctors } = await this.doctorService.findAll({});

    for (const doctor of doctors) {
      await this.timeSlotService.ensureSlots({
        doctorId: doctor.id,
        startDate,
        endDate,
      });
    }
  }
}
