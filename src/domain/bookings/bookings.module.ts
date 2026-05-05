import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MercadoPagoClient } from '../../adapter/clients/mercado-pago.client';
import { AuthModule } from '../auth/auth.module';
import { CourtsModule } from '../courts/courts.module';
import { UsersModule } from '../users/users.module';
import { ApproveBookingController } from './controller/approve-booking.controller';
import { CancelBookingController } from './controller/cancel-booking.controller';
import { IndexBookingsController } from './controller/index-bookings.controller';
import { SaveBookingController } from './controller/save-booking.controller';
import { Booking } from './entity/booking.entity';
import { ApproveBookingService } from './service/approve-booking.service';
import { CancelBookingService } from './service/cancel-booking.service';
import { IndexBookingsService } from './service/index-bookings.service';
import { SaveBookingService } from './service/save-booking.service';
import { BuyBookingBundleController } from './subdomain/bundles/controller/buy-booking-bundle.controller';
import { DeactivateBookingBundleController } from './subdomain/bundles/controller/deactivate-booking-bundle.controller';
import { GetBookingBundleController } from './subdomain/bundles/controller/get-booking-bundle.controller';
import { IndexBookingBundlesController } from './subdomain/bundles/controller/index-booking-bundles.controller';
import { SaveBookingBundlesController } from './subdomain/bundles/controller/save-booking-bundles.controller';
import { UpdateBookingBundleController } from './subdomain/bundles/controller/update-booking-bundle.controller';
import { BookingBundle } from './subdomain/bundles/entity/booking-bundle.entity';
import { BookingBundlePurchaseIntent } from './subdomain/bundles/entity/booking-bundle-purchase-intent.entity';
import { BuyBookingBundleService } from './subdomain/bundles/service/buy-booking-bundle.service';
import { DeactivateBookingBundleService } from './subdomain/bundles/service/deactivate-booking-bundle.service';
import { GetBookingBundleService } from './subdomain/bundles/service/get-booking-bundle.service';
import { IndexBookingBundlesService } from './subdomain/bundles/service/index-booking-bundles.service';
import { SaveBookingBundlesService } from './subdomain/bundles/service/save-booking-bundles.service';
import { UpdateBookingBundleService } from './subdomain/bundles/service/update-booking-bundle.service';
import { MercadoPagoPaymentCallbacksController } from './subdomain/payments/controller/mercado-pago-payment-callbacks.controller';
import { BookingPayment } from './subdomain/payments/entity/booking-payment.entity';
import { MercadoPagoPaymentCallbackService } from './subdomain/payments/service/mercado-pago-payment-callback.service';
import { MercadoPagoPreferenceService } from './subdomain/payments/service/mercado-pago-preference.service';
import { BookingBundleBalance } from './subdomain/bundles/entity/booking-bundle-balance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      BookingBundle,
      BookingPayment,
      BookingBundlePurchaseIntent,
      BookingBundleBalance,
    ]),
    CourtsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [
    SaveBookingController,
    IndexBookingsController,
    ApproveBookingController,
    CancelBookingController,
    IndexBookingBundlesController,
    GetBookingBundleController,
    DeactivateBookingBundleController,
    UpdateBookingBundleController,
    SaveBookingBundlesController,
    BuyBookingBundleController,
    MercadoPagoPaymentCallbacksController,
  ],
  providers: [
    MercadoPagoClient,
    MercadoPagoPreferenceService,
    MercadoPagoPaymentCallbackService,
    SaveBookingService,
    IndexBookingsService,
    ApproveBookingService,
    CancelBookingService,
    IndexBookingBundlesService,
    GetBookingBundleService,
    UpdateBookingBundleService,
    DeactivateBookingBundleService,
    SaveBookingBundlesService,
    BuyBookingBundleService,
  ],
})
export class BookingsModule {}
