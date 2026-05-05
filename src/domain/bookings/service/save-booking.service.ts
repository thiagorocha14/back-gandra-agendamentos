import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Court } from '../../courts/entity/court.entity';
import { User } from '../../users/entity/user.entity';
import { UserType } from '../../users/enum/user-type.enum';
import { CreateBookingDto } from '../dto/create-booking.dto';
import type { MercadoPagoCheckoutPayload } from '../dto/save-booking-response.dto';
import { Booking, BookingStatus } from '../entity/booking.entity';
import { MercadoPagoPayerInput, MercadoPagoPreferenceService } from '../subdomain/payments/service/mercado-pago-preference.service';
import { computeBookingPriceBrl } from '../subdomain/payments/util/compute-booking-price.util';

export type SaveBookingResult = {
  booking: Booking;
  mercadoPago?: MercadoPagoCheckoutPayload;
};

function isDuplicateKeyError(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) return false;
  const driverError = (
    error as QueryFailedError & {
      driverError?: { errno?: number; code?: string };
    }
  ).driverError;
  return (
    driverError?.errno === 1062 || driverError?.code === 'ER_DUP_ENTRY'
  );
}

@Injectable()
export class SaveBookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Court)
    private readonly courtRepository: Repository<Court>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mercadoPagoPreferenceService: MercadoPagoPreferenceService,
  ) {}

  async execute(dto: CreateBookingDto): Promise<SaveBookingResult> {
    const court = await this.courtRepository.findOne({
      where: { id: dto.courtId, active: true },
    });
    if (!court) {
      throw new NotFoundException('Quadra não encontrada ou inativa.');
    }

    let status = BookingStatus.PENDING;
    let approvedBy: string | null = null;
    let approvedAt: Date | null = null;
    let user: User | null = null;
    let needsMercadoPagoCheckout = true;

    if (dto.userId) {
      user = await this.userRepository.findOne({
        where: { id: dto.userId, active: true },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado ou inativo.');
      }
      if (
        user.userType === UserType.MEMBER ||
        user.userType === UserType.ADMIN
      ) {
        status = BookingStatus.APPROVED;
        approvedBy = user.id;
        approvedAt = new Date();
        needsMercadoPagoCheckout = false;
      }
    }

    const computedPrice = computeBookingPriceBrl({
      court,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    const price =
      user?.userType === UserType.REGULAR
        ? computedPrice
        : dto.price ?? computedPrice;

    const booking = this.bookingRepository.create({
      courtId: dto.courtId,
      userId: dto.userId ?? null,
      guestName: dto.guestName ?? null,
      phone: dto.phone ?? null,
      bookingDate: dto.bookingDate,
      startTime: this.normalizeTime(dto.startTime),
      endTime: this.normalizeTime(dto.endTime),
      status,
      price,
      approvedBy,
      approvedAt,
    });

    let saved: Booking;
    try {
      saved = await this.bookingRepository.save(booking);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException(
          'Já existe agendamento para esta quadra neste horário.',
        );
      }
      throw error;
    }

    if (!needsMercadoPagoCheckout) {
      return { booking: saved };
    }

    let payer: MercadoPagoPayerInput;
    
    if (user) {
      payer = {
        email: user.email,
        name: user.name.trim().split(/\s+/)[0],
        surname: user.name.trim().split(/\s+/).slice(1).join(' '),
      };
    } else {
      payer = {
        name: dto.guestName?.trim().split(/\s+/)[0],
        surname: dto.guestName?.trim().split(/\s+/).slice(1).join(' '),
      };
    }

    let preference;
    try {
      preference = await this.mercadoPagoPreferenceService.createForBooking({
        bookingId: saved.id,
        title: `Agendamento — ${court.name}`,
        description: `${saved.bookingDate} ${saved.startTime} às ${saved.endTime}`,
        amountBrl: saved.price,
        payer,
      });
    } catch (e) {
      await this.bookingRepository.delete({ id: saved.id });
      throw e;
    }

    const preferenceId = preference.id;
    const initPoint = preference.init_point;
    if (!preferenceId || !initPoint) {
      await this.bookingRepository.delete({ id: saved.id });
      throw new BadRequestException(
        'Resposta inválida do Mercado Pago ao criar preferência.',
      );
    }

    return {
      booking: saved,
      mercadoPago: {
        preferenceId,
        initPoint,
        sandboxInitPoint: preference.sandbox_init_point,
      },
    };
  }

  private normalizeTime(value: string): string {
    return value.length === 5 ? `${value}:00` : value;
  }
}
