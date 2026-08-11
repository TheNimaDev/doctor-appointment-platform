import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteMeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
