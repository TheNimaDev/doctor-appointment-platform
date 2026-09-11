import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './entities';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { DoctorModule } from '@/modules/doctor';
import { DoctorClinicModule } from '@/modules/doctor-clinic';
import { ClinicModule } from '@/modules/clinic';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot]), DoctorModule, DoctorClinicModule, ClinicModule],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}
