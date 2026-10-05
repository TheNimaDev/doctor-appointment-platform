import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription, PrescriptionItem } from './entities';
import { AppointmentModule } from '@/modules/appointment';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription, PrescriptionItem]), AppointmentModule],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
})
export class PrescriptionModule {}
