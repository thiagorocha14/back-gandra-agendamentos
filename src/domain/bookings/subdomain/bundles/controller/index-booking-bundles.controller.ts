import { Controller, Get } from '@nestjs/common';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { IndexBookingBundlesService } from '../service/index-booking-bundles.service';

@Controller('booking-bundles')
export class IndexBookingBundlesController {
  constructor(
    private readonly indexBookingBundlesService: IndexBookingBundlesService,
  ) {}

  @Get()
  async indexBookingBundles(): Promise<BookingBundle[]> {
    return this.indexBookingBundlesService.execute();
  }
}
