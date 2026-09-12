import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSpecialty } from './entities';
import { DoctorSpecialtyController } from './doctor-specialty.controller';
import { DoctorSpecialtyService } from './doctor-specialty.service';
import { DoctorModule } from '../doctor/doctor.module';
import { SpecialtyModule } from '../specialty';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSpecialty]), DoctorModule, SpecialtyModule],
  controllers: [DoctorSpecialtyController],
  providers: [DoctorSpecialtyService],
  exports: [DoctorSpecialtyService],
})
export class DoctorSpecialtyModule {}
