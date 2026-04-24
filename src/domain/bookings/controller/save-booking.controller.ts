import { Body, Controller, Post } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { Booking } from '../entity/booking.entity';
import { SaveBookingService } from '../service/save-booking.service';

@Controller('bookings')
export class SaveBookingController {
  constructor(private readonly saveBookingService: SaveBookingService) {}

  @Post()
  async saveBooking(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.saveBookingService.execute(dto);
  }
}
