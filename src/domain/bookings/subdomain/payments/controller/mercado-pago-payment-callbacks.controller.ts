import { Controller, Get, Query } from '@nestjs/common';
import { MercadoPagoPaymentCallbackService } from '../service/mercado-pago-payment-callback.service';
import type { MercadoPagoReturnQuery } from '../service/mercado-pago-payment-callback.service';

@Controller('payments/mercadopago')
export class MercadoPagoPaymentCallbacksController {
  constructor(
    private readonly mercadoPagoPaymentCallbackService: MercadoPagoPaymentCallbackService,
  ) {}

  @Get('success')
  async success(@Query() query: MercadoPagoReturnQuery) {
    return this.mercadoPagoPaymentCallbackService.handleSuccess(query);
  }

  @Get('failure')
  async failure(@Query() query: MercadoPagoReturnQuery) {
    return this.mercadoPagoPaymentCallbackService.handleFailure(query);
  }

  @Get('pending')
  async pending(@Query() query: MercadoPagoReturnQuery) {
    return this.mercadoPagoPaymentCallbackService.handlePending(query);
  }
}
