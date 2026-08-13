import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSpecialty } from './entities';
import { DoctorSpecialtyController } from './doctor-specialty.controller';
import { DoctorSpecialtyService } from './doctor-specialty.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSpecialty])],
  controllers: [DoctorSpecialtyController],
  providers: [DoctorSpecialtyService],
  exports: [DoctorSpecialtyService],
})
export class DoctorSpecialtyModule {}
