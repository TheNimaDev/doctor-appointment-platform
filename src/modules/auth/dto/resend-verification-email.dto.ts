import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class ResendVerificationEmailDto extends PickType(RegisterDto, ['email', 'password'] as const) {}
