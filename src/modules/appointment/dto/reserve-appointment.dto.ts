import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReserveAppointmentDto {
  @IsNotEmpty()
  @IsUUID()
  timeSlotId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
