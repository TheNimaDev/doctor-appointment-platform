import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot])],
})
export class TimeSlotModule {}
