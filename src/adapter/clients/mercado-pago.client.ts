import { MercadoPagoConfig, Preference } from 'mercadopago';
import type {
  PreferenceRequest,
  PreferenceResponse,
} from 'mercadopago/dist/clients/preference/commonTypes';

export class MercadoPagoClient {
  private readonly mercadoPago: MercadoPagoConfig;

  constructor() {
    this.mercadoPago = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN ?? '',
    });
  }

  async createPreference(body: PreferenceRequest): Promise<PreferenceResponse> {
    const preference = new Preference(this.mercadoPago);
    return preference.create({ body });
  }
}