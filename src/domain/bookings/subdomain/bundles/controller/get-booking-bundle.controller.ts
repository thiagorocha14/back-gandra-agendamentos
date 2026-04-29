import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../../../auth/guard/admin-auth.guard';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { GetBookingBundleService } from '../service/get-booking-bundle.service';

@Controller('booking-bundles')
export class GetBookingBundleController {
  constructor(
    private readonly getBookingBundleService: GetBookingBundleService,
  ) {}

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async getBookingBundle(@Param('id') id: string): Promise<BookingBundle> {
    return this.getBookingBundleService.execute(id);
  }
}
