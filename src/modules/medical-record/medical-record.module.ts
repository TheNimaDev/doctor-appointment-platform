import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord])],
})
export class MedicalRecordModule {}
