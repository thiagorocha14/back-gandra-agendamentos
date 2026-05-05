import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class BuyBookingBundleDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bundleId: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
