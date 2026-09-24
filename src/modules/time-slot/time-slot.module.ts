import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './entities';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { DoctorModule } from '@/modules/doctor';
import { DoctorClinicModule } from '@/modules/doctor-clinic';
import { ClinicModule } from '@/modules/clinic';
import { DoctorScheduleModule } from '@/modules/doctor-schedule';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot]), DoctorModule, DoctorClinicModule, ClinicModule, DoctorScheduleModule],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}
