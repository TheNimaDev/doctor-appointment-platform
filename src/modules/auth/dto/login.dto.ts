import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class LoginDto extends PickType(RegisterDto, ['email', 'password'] as const) {
  @IsOptional()
  @IsBoolean()
  remember: boolean;
}
