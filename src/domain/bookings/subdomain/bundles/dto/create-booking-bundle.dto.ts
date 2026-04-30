import { Type } from 'class-transformer';
import {
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookingBundleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  description: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalHours: number;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;
}
