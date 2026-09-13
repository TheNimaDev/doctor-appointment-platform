import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorClinic } from './entities';
import { DoctorClinicController } from './doctor-clinic.controller';
import { DoctorClinicService } from './doctor-clinic.service';
import { DoctorModule } from '@/modules/doctor';
import { ClinicModule } from '@/modules/clinic';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorClinic]), DoctorModule, ClinicModule],
  controllers: [DoctorClinicController],
  providers: [DoctorClinicService],
  exports: [DoctorClinicService],
})
export class DoctorClinicModule {}
