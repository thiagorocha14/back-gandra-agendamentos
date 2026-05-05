import { BadRequestException, Injectable } from '@nestjs/common';
import type { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { MercadoPagoClient } from '../../../../../adapter/clients/mercado-pago.client';
import {
  buildBookingExternalReference,
  buildBundlePurchaseExternalReference,
} from '../util/mercado-pago-external-reference.util';

export type MercadoPagoPayerInput = {
  email?: string;
  name?: string;
  surname?: string;
};

@Injectable()
export class MercadoPagoPreferenceService {
  constructor(private readonly mercadoPagoClient: MercadoPagoClient) {}

  private returnBaseUrl(): string {
    const base =
      process.env.MP_RETURN_BASE_URL ??
      `http://127.0.0.1:${process.env.APP_PORT ?? process.env.PORT ?? '3000'}`;
    return base.replace(/\/$/, '');
  }

  private buildBackUrls() {
    const base = this.returnBaseUrl();
    return {
      success: `${base}/payments/mercadopago/success`,
      failure: `${base}/payments/mercadopago/failure`,
      pending: `${base}/payments/mercadopago/pending`,
    };
  }

  async createForBooking(params: {
    bookingId: string;
    title: string;
    description?: string;
    amountBrl: string;
    payer?: MercadoPagoPayerInput;
  }): Promise<PreferenceResponse> {
    const unitPrice = Number(params.amountBrl.replace(',', '.'));
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new BadRequestException(
        'Valor do agendamento inválido para o checkout.',
      );
    }

    const notificationUrl = process.env.MP_NOTIFICATION_URL?.trim();

    return this.mercadoPagoClient.createPreference({
      items: [
        {
          id: `booking-${params.bookingId}`,
          title: params.title,
          description: params.description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: unitPrice,
        },
      ],
      payer: params.payer?.email
        ? {
            email: params.payer.email,
            name: params.payer.name,
            surname: params.payer.surname,
          }
        : undefined,
      external_reference: buildBookingExternalReference(params.bookingId),
      back_urls: this.buildBackUrls(),
      auto_return: 'approved',
      ...(notificationUrl ? { notification_url: notificationUrl } : {}),
    });
  }

  async createForBundlePurchase(params: {
    purchaseIntentId: string;
    title: string;
    description?: string;
    amountBrl: string;
    payer?: MercadoPagoPayerInput;
  }): Promise<PreferenceResponse> {
    const unitPrice = Number(params.amountBrl.replace(',', '.'));
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new BadRequestException('Valor do pacote inválido para o checkout.');
    }

    const notificationUrl = process.env.MP_NOTIFICATION_URL?.trim();

    return this.mercadoPagoClient.createPreference({
      items: [
        {
          id: `bundle-purchase-${params.purchaseIntentId}`,
          title: params.title,
          description: params.description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: unitPrice,
        },
      ],
      payer: params.payer?.email
        ? {
            email: params.payer.email,
            name: params.payer.name,
            surname: params.payer.surname,
          }
        : undefined,
      external_reference: buildBundlePurchaseExternalReference(
        params.purchaseIntentId,
      ),
      back_urls: this.buildBackUrls(),
      auto_return: 'approved',
      ...(notificationUrl ? { notification_url: notificationUrl } : {}),
    });
  }
}
