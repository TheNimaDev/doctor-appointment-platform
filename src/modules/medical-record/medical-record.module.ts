import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';
import { AppointmentModule } from '@/modules/appointment';
import { DoctorModule } from '@/modules/doctor';
import { PatientModule } from '@/modules/patient';
import { ClinicModule } from '@/modules/clinic';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord]), AppointmentModule, DoctorModule, PatientModule, ClinicModule],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
})
export class MedicalRecordModule {}
