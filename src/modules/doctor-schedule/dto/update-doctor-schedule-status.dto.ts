import { IsEnum, IsNotEmpty } from 'class-validator';
import { ScheduleStatus } from '../enums';

export class UpdateDoctorScheduleStatusDto {
  @IsNotEmpty()
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}
