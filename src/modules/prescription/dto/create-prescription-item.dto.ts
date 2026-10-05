import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionItemDto {
  @IsString()
  @IsNotEmpty()
  medicineName: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsString()
  @IsNotEmpty()
  usage: string;

  @IsOptional()
  @IsString()
  duration?: string | null;

  @IsOptional()
  @IsNumber()
  quantity?: number | null;
}
