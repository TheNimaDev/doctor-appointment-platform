import { IsEnum, IsNotEmpty } from 'class-validator';
import { DoctorStatus } from '../enums';

export class FindDoctorDto {
  @IsNotEmpty()
  @IsEnum(DoctorStatus)
  status: DoctorStatus;
}
