import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../../../auth/guard/admin-auth.guard';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { DeactivateBookingBundleService } from '../service/deactivate-booking-bundle.service';

@Controller('booking-bundles')
export class DeactivateBookingBundleController {
  constructor(
    private readonly deactivateBookingBundleService: DeactivateBookingBundleService,
  ) {}

  @Patch(':id/deactivate')
  @UseGuards(AdminAuthGuard)
  async deactivateBookingBundle(
    @Param('id') id: string,
  ): Promise<BookingBundle> {
    return this.deactivateBookingBundleService.execute(id);
  }
}
