import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClinicStatus } from '../enums';

export class UpdateClinicStatusDto {
  @IsNotEmpty()
  @IsEnum(ClinicStatus)
  status: ClinicStatus;
}
