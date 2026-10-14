import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  gateway: string;
}
