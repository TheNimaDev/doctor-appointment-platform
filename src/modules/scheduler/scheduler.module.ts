import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { AppointmentJob, TimeSlotJob } from './jobs';
import { DoctorModule } from '@/modules/doctor';
import { TimeSlotModule } from '@/modules/time-slot';
import { AppointmentModule } from '@/modules/appointment';

@Module({
  providers: [SchedulerService, TimeSlotJob, AppointmentJob],
  imports: [DoctorModule, TimeSlotModule, AppointmentModule],
})
export class SchedulerModule {}
