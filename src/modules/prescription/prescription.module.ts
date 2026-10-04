import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription])],
})
export class PrescriptionModule {}
