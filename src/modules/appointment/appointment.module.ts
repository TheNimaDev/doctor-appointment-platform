import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
})
export class AppointmentModule {}
