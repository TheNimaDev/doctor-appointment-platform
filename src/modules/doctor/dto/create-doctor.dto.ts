import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  medicalCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string | null;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  experienceYears: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  consultationFee: string;
}
