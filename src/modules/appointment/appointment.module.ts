import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TimeSlotModule } from '@/modules/time-slot';
import { DoctorModule } from '@/modules/doctor';
import { PatientModule } from '@/modules/patient';
import { PaymentModule } from '@/modules/payment';
import { DoctorClinicModule } from '@/modules/doctor-clinic';
import { DoctorScheduleModule } from '@/modules/doctor-schedule';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), TimeSlotModule, DoctorModule, PatientModule,PaymentModule,DoctorClinicModule,DoctorScheduleModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports:[AppointmentService]
})
export class AppointmentModule {}
