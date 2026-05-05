import { Body, Controller, Post } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { SaveBookingResponseDto } from '../dto/save-booking-response.dto';
import { SaveBookingService } from '../service/save-booking.service';

@Controller('bookings')
export class SaveBookingController {
  constructor(private readonly saveBookingService: SaveBookingService) {}

  @Post()
  async saveBooking(
    @Body() dto: CreateBookingDto,
  ): Promise<SaveBookingResponseDto> {
    return this.saveBookingService.execute(dto);
  }
}
