import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CourtsModule } from '../courts/courts.module';
import { ApproveBookingController } from './controller/approve-booking.controller';
import { CancelBookingController } from './controller/cancel-booking.controller';
import { IndexBookingsController } from './controller/index-bookings.controller';
import { SaveBookingController } from './controller/save-booking.controller';
import { Booking } from './entity/booking.entity';
import { ApproveBookingService } from './service/approve-booking.service';
import { CancelBookingService } from './service/cancel-booking.service';
import { IndexBookingsService } from './service/index-bookings.service';
import { SaveBookingService } from './service/save-booking.service';
import { IndexBookingBundlesController } from './subdomain/bundles/controller/index-booking-bundles.controller';
import { SaveBookingBundlesController } from './subdomain/bundles/controller/save-booking-bundles.controller';
import { BookingBundle } from './subdomain/bundles/entity/booking-bundle.entity';
import { IndexBookingBundlesService } from './subdomain/bundles/service/index-booking-bundles.service';
import { SaveBookingBundlesService } from './subdomain/bundles/service/save-booking-bundles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingBundle]),
    CourtsModule,
    AuthModule,
  ],
  controllers: [
    SaveBookingController,
    IndexBookingsController,
    ApproveBookingController,
    CancelBookingController,
    SaveBookingBundlesController,
    IndexBookingBundlesController,
  ],
  providers: [
    SaveBookingService,
    IndexBookingsService,
    ApproveBookingService,
    CancelBookingService,
    SaveBookingBundlesService,
    IndexBookingBundlesService,
  ],
})
export class BookingsModule {}
