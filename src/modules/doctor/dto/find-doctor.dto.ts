import { IsEnum, IsOptional } from 'class-validator';
import { DoctorStatus } from '../enums';

export class FindDoctorDto {
  @IsOptional()
  @IsEnum(DoctorStatus)
  status?: DoctorStatus;
}
