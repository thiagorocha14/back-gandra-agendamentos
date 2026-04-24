import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsModule } from '../courts/courts.module';
import { IndexBookingsController } from './controller/index-bookings.controller';
import { SaveBookingController } from './controller/save-booking.controller';
import { Booking } from './entity/booking.entity';
import { IndexBookingsService } from './service/index-bookings.service';
import { SaveBookingService } from './service/save-booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), CourtsModule],
  controllers: [SaveBookingController, IndexBookingsController],
  providers: [SaveBookingService, IndexBookingsService],
})
export class BookingsModule {}
