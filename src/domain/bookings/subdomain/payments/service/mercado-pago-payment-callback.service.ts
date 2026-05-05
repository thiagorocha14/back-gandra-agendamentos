import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingBundlePurchaseIntent } from '../../bundles/entity/booking-bundle-purchase-intent.entity';
import { BookingBundleBalance } from '../../bundles/entity/booking-bundle-balance.entity';
import { Booking, BookingStatus } from '../../../entity/booking.entity';
import { BookingPayment } from '../entity/booking-payment.entity';
import { parseMercadoPagoExternalReference } from '../util/mercado-pago-external-reference.util';

export type MercadoPagoReturnQuery = {
  external_reference?: string;
  collection_status?: string;
  status?: string;
  preference_id?: string;
};

@Injectable()
export class MercadoPagoPaymentCallbackService {
  private readonly logger = new Logger(MercadoPagoPaymentCallbackService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingPayment)
    private readonly bookingPaymentRepository: Repository<BookingPayment>,
    @InjectRepository(BookingBundlePurchaseIntent)
    private readonly purchaseIntentRepository: Repository<BookingBundlePurchaseIntent>,
    @InjectRepository(BookingBundleBalance)
    private readonly bundleBalanceRepository: Repository<BookingBundleBalance>,
  ) {}

  async handleSuccess(query: MercadoPagoReturnQuery): Promise<{
    handled: boolean;
    message: string;
  }> {
    const parsed = parseMercadoPagoExternalReference(query.external_reference);
    if (!parsed) {
      throw new BadRequestException('external_reference inválido ou ausente.');
    }

    const collectionStatus = query.collection_status ?? query.status;
    if (collectionStatus && collectionStatus !== 'approved') {
      return {
        handled: false,
        message: `Pagamento não aprovado (status: ${collectionStatus}).`,
      };
    }

    if (parsed.kind === 'booking') {
      return this.approveBookingIfNeeded(parsed.bookingId);
    }

    return this.fulfillBundlePurchase(parsed.purchaseIntentId);
  }

  async handleFailure(query: MercadoPagoReturnQuery): Promise<{
    handled: boolean;
    message: string;
  }> {
    const parsed = parseMercadoPagoExternalReference(query.external_reference);
    if (!parsed) {
      throw new BadRequestException('external_reference inválido ou ausente.');
    }

    if (parsed.kind === 'booking') {
      return this.cancelBookingIfPending(parsed.bookingId);
    }

    this.logger.log(
      `Compra de pacote não concluída (intent ${parsed.purchaseIntentId}).`,
    );
    return {
      handled: true,
      message: 'Compra de pacote não finalizada; nenhum saldo foi gerado.',
    };
  }

  async handlePending(query: MercadoPagoReturnQuery): Promise<{
    handled: boolean;
    message: string;
  }> {
    const parsed = parseMercadoPagoExternalReference(query.external_reference);
    if (!parsed) {
      throw new BadRequestException('external_reference inválido ou ausente.');
    }

    if (parsed.kind === 'booking') {
      const booking = await this.bookingRepository.findOne({
        where: { id: parsed.bookingId },
      });
      if (!booking) {
        throw new NotFoundException('Agendamento não encontrado.');
      }
      return {
        handled: true,
        message:
          'Pagamento em análise. O agendamento permanece pendente até confirmação.',
      };
    }

    return {
      handled: true,
      message:
        'Pagamento do pacote em análise. O saldo será liberado após confirmação.',
    };
  }

  private async approveBookingIfNeeded(
    bookingId: string,
  ): Promise<{ handled: boolean; message: string }> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (booking.status === BookingStatus.APPROVED) {
      return {
        handled: true,
        message: 'Agendamento já estava aprovado.',
      };
    }

    if (booking.status !== BookingStatus.PENDING) {
      return {
        handled: false,
        message: `Agendamento não pode ser aprovado pelo checkout (status: ${booking.status}).`,
      };
    }

    booking.status = BookingStatus.APPROVED;
    booking.approvedAt = new Date();
    booking.approvedBy = null;

    await this.bookingRepository.manager.transaction(async (manager) => {
      await manager.save(Booking, booking);
      const existing = await manager.findOne(BookingPayment, {
        where: { bookingId: booking.id },
      });
      if (!existing) {
        const payment = manager.create(BookingPayment, {
          bookingId: booking.id,
          paymentMethod: 'mercadopago',
          amount: booking.price,
          bundleUseId: null,
        });
        await manager.save(BookingPayment, payment);
      }
    });

    return {
      handled: true,
      message: 'Agendamento aprovado e pagamento registrado.',
    };
  }

  private async cancelBookingIfPending(
    bookingId: string,
  ): Promise<{ handled: boolean; message: string }> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (booking.status === BookingStatus.PENDING) {
      booking.status = BookingStatus.CANCELLED;
      await this.bookingRepository.save(booking);
      return {
        handled: true,
        message: 'Agendamento cancelado por falha no pagamento.',
      };
    }

    return {
      handled: false,
      message: `Nenhuma alteração: agendamento com status ${booking.status}.`,
    };
  }

  private async fulfillBundlePurchase(
    purchaseIntentId: string,
  ): Promise<{ handled: boolean; message: string }> {
    const intent = await this.purchaseIntentRepository.findOne({
      where: { id: purchaseIntentId },
    });
    if (!intent) {
      throw new NotFoundException('Pedido de compra de pacote não encontrado.');
    }

    if (intent.fulfilled) {
      return {
        handled: true,
        message: 'Saldo do pacote já havia sido gerado.',
      };
    }

    const hoursStr = String(intent.hoursSnapshot);
    const balance = this.bundleBalanceRepository.create({
      userId: intent.userId,
      bundleId: intent.bundleId,
      hoursTotal: hoursStr,
      hoursUsed: '0',
      hoursRemaining: hoursStr,
      expiresAt: null,
      amountPaid: intent.amountSnapshot,
    });

    await this.bundleBalanceRepository.manager.transaction(async (manager) => {
      await manager.save(BookingBundleBalance, balance);
      intent.fulfilled = true;
      await manager.save(BookingBundlePurchaseIntent, intent);
    });

    return {
      handled: true,
      message: 'Saldo de horas do pacote criado com sucesso.',
    };
  }
}
