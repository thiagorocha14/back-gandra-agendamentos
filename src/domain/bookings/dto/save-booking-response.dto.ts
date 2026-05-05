import { Booking } from '../entity/booking.entity';

export type MercadoPagoCheckoutPayload = {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
};

export class SaveBookingResponseDto {
  booking: Booking;
  mercadoPago?: MercadoPagoCheckoutPayload;
}
