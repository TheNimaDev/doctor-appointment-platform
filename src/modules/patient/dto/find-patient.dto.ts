import { IsEnum, IsOptional } from 'class-validator';
import { Gender } from '../enums';

export class FindPatientDto {
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
