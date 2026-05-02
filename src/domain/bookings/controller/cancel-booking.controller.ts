import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../auth/guard/admin-auth.guard';
import { Booking } from '../entity/booking.entity';
import { CancelBookingService } from '../service/cancel-booking.service';

@Controller('bookings')
export class CancelBookingController {
  constructor(
    private readonly cancelBookingService: CancelBookingService,
  ) {}

  @Put('cancel-booking/:id')
  @UseGuards(AdminAuthGuard)
  async cancelBooking(@Param('id') id: string): Promise<Booking> {
    return this.cancelBookingService.execute(id);
  }
}
