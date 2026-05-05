import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../users/entity/user.entity';
import { MercadoPagoPreferenceService } from '../../payments/service/mercado-pago-preference.service';
import { BuyBookingBundleDto } from '../dto/buy-booking-bundle.dto';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { BookingBundlePurchaseIntent } from '../entity/booking-bundle-purchase-intent.entity';

export type BuyBookingBundleResult = {
  purchaseIntentId: string;
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
};

@Injectable()
export class BuyBookingBundleService {
  constructor(
    @InjectRepository(BookingBundle)
    private readonly bookingBundleRepository: Repository<BookingBundle>,
    @InjectRepository(BookingBundlePurchaseIntent)
    private readonly purchaseIntentRepository: Repository<BookingBundlePurchaseIntent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mercadoPagoPreferenceService: MercadoPagoPreferenceService,
  ) {}

  async execute(dto: BuyBookingBundleDto): Promise<BuyBookingBundleResult> {
    const bundleId = String(dto.bundleId);
    const bundle = await this.bookingBundleRepository.findOne({
      where: { id: bundleId, active: true },
    });
    if (!bundle) {
      throw new NotFoundException('Pacote não encontrado ou inativo.');
    }

    const user = await this.userRepository.findOne({
      where: { id: dto.userId, active: true },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou inativo.');
    }

    const intent = this.purchaseIntentRepository.create({
      userId: user.id,
      bundleId: bundle.id,
      mpPreferenceId: null,
      amountSnapshot: bundle.price,
      hoursSnapshot: bundle.totalHours,
      fulfilled: false,
    });
    const savedIntent = await this.purchaseIntentRepository.save(intent);

    const [firstName, ...rest] = user.name.trim().split(/\s+/);
    const surname = rest.length > 0 ? rest.join(' ') : undefined;

    let preference;
    try {
      preference = await this.mercadoPagoPreferenceService.createForBundlePurchase(
        {
          purchaseIntentId: savedIntent.id,
          title: `Pacote: ${bundle.name}`,
          description: bundle.description?.slice(0, 200),
          amountBrl: bundle.price,
          payer: {
            email: user.email,
            name: firstName,
            surname,
          },
        },
      );
    } catch (e) {
      await this.purchaseIntentRepository.delete({ id: savedIntent.id });
      throw e;
    }

    const preferenceId = preference.id;
    const initPoint = preference.init_point;
    if (!preferenceId || !initPoint) {
      await this.purchaseIntentRepository.delete({ id: savedIntent.id });
      throw new BadRequestException(
        'Resposta inválida do Mercado Pago ao criar preferência.',
      );
    }

    savedIntent.mpPreferenceId = preferenceId;
    await this.purchaseIntentRepository.save(savedIntent);

    return {
      purchaseIntentId: savedIntent.id,
      preferenceId,
      initPoint,
      sandboxInitPoint: preference.sandbox_init_point,
    };
  }
}
