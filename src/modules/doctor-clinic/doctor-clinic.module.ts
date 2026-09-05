import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorClinic } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorClinic])],
})
export class DoctorClinicModule {}
