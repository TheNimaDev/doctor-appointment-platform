import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}