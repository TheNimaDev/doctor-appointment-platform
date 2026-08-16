import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic])],
})
export class ClinicModule {}
