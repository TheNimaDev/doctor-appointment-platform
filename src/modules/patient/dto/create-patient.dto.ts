import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { BloodType, Gender } from '../enums';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  nationalCode: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string | null;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  emergencyContactName?: string | null;

  @IsOptional()
  @IsString()
  @Length(11, 11)
  emergencyContactPhone?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string | null;
}
