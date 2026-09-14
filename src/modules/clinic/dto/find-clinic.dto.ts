import { IsEnum, IsOptional } from 'class-validator';
import { ClinicStatus } from '../enums';

export class FindClinicDto {
  @IsOptional()
  @IsEnum(ClinicStatus)
  status?: ClinicStatus;
}
