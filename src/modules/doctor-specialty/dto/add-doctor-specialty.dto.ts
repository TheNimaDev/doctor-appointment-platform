import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AddDoctorSpecialtyDto {
  @IsNotEmpty()
  @IsUUID()
  specialtyId: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
