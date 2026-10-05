import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreatePrescriptionItemDto } from './create-prescription-item.dto';

export class CreatePrescriptionDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items: CreatePrescriptionItemDto[];
}
