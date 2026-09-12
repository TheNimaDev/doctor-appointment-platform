import { IsEnum, IsNotEmpty, IsString, Max, Min, IsNumber, Matches, IsUUID } from 'class-validator';
import { DayOfWeek } from '../enums';

export class CreateDoctorScheduleDto {
  @IsNotEmpty()
  @IsUUID()
  clinicId: string;

  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must be in HH:mm format.',
  })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime must be in HH:mm format.',
  })
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(240)
  slotDuration: number;
}
