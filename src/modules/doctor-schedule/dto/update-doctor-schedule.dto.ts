import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDoctorScheduleDto } from './create-doctor-schedule.dto';

export class UpdateDoctorScheduleDto extends PartialType(OmitType(CreateDoctorScheduleDto, ['clinicId'] as const)) {}
