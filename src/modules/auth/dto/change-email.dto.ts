import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  newPassword: string;
}
