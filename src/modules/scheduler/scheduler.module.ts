import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { TimeSlotJob } from './jobs';
import { DoctorModule } from '@/modules/doctor';
import { TimeSlotModule } from '@/modules/time-slot';

@Module({
  providers: [SchedulerService, TimeSlotJob],
  imports: [DoctorModule, TimeSlotModule],
})
export class SchedulerModule {}
