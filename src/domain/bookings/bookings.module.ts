import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsModule } from '../courts/courts.module';
import { IndexBookingsController } from './controller/index-bookings.controller';
import { SaveBookingController } from './controller/save-booking.controller';
import { Booking } from './entity/booking.entity';
import { IndexBookingsService } from './service/index-bookings.service';
import { SaveBookingService } from './service/save-booking.service';
import { IndexBookingBundlesController } from './subdomain/bundles/controller/index-booking-bundles.controller';
import { SaveBookingBundlesController } from './subdomain/bundles/controller/save-booking-bundles.controller';
import { BookingBundle } from './subdomain/bundles/entity/booking-bundle.entity';
import { IndexBookingBundlesService } from './subdomain/bundles/service/index-booking-bundles.service';
import { SaveBookingBundlesService } from './subdomain/bundles/service/save-booking-bundles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookingBundle]), CourtsModule],
  controllers: [
    SaveBookingController,
    IndexBookingsController,
    SaveBookingBundlesController,
    IndexBookingBundlesController,
  ],
  providers: [
    SaveBookingService,
    IndexBookingsService,
    SaveBookingBundlesService,
    IndexBookingBundlesService,
  ],
})
export class BookingsModule {}
