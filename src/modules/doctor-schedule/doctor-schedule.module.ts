import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedule } from './entities';
import { DoctorScheduleController } from './doctor-schedule.controller';
import { DoctorScheduleService } from './doctor-schedule.service';
import { DoctorClinicModule } from '@/modules/doctor-clinic';
import { DoctorModule } from '@/modules/doctor/doctor.module';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSchedule]), DoctorClinicModule, DoctorModule],
  controllers: [DoctorScheduleController],
  providers: [DoctorScheduleService],
})
export class DoctorScheduleModule {}
