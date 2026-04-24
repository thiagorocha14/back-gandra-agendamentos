import { Controller, Get } from '@nestjs/common';
import { Booking } from '../entity/booking.entity';
import { IndexBookingsService } from '../service/index-bookings.service';

@Controller('bookings')
export class IndexBookingsController {
  constructor(private readonly indexBookingsService: IndexBookingsService) {}

  @Get()
  async indexBookings(): Promise<Booking[]> {
    return this.indexBookingsService.execute();
  }
}
