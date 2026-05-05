import { Body, Controller, Post } from '@nestjs/common';
import { BuyBookingBundleDto } from '../dto/buy-booking-bundle.dto';
import {
  BuyBookingBundleResult,
  BuyBookingBundleService,
} from '../service/buy-booking-bundle.service';

@Controller('booking-bundles')
export class BuyBookingBundleController {
  constructor(private readonly buyBookingBundleService: BuyBookingBundleService) {}

  @Post('buy-booking-bundle')
  async buyBookingBundle(
    @Body() dto: BuyBookingBundleDto,
  ): Promise<BuyBookingBundleResult> {
    return this.buyBookingBundleService.execute(dto);
  }
}
