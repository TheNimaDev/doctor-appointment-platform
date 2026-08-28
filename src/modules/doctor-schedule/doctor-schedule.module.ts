import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedule } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSchedule])],
})
export class DoctorScheduleModule {}
