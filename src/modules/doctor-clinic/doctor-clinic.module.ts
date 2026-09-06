import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorClinic } from './entities';
import { DoctorClinicController } from './doctor-clinic.controller';
import { DoctorClinicService } from './doctor-clinic.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorClinic])],
  controllers: [DoctorClinicController],
  providers: [DoctorClinicService],
})
export class DoctorClinicModule {}
