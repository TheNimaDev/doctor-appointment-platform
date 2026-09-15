import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TimeSlotModule } from '@/modules/time-slot';
import { DoctorModule } from '@/modules/doctor';
import { ClinicModule } from '@/modules/clinic';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), TimeSlotModule, DoctorModule, ClinicModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
