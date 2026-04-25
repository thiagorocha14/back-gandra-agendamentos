import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Court } from '../../courts/entity/court.entity';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { Booking, BookingStatus } from '../entity/booking.entity';

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
  ) {}

  async execute(dto: CreateBookingDto): Promise<Booking> {
    const court = await this.courtRepository.findOne({
      where: { id: dto.courtId, active: true },
    });
    if (!court) {
      throw new NotFoundException('Quadra não encontrada ou inativa.');
    }

    const booking = this.bookingRepository.create({
      courtId: dto.courtId,
      userId: dto.userId ?? null,
      guestName: dto.guestName ?? null,
      phone: dto.phone ?? null,
      bookingDate: dto.bookingDate,
      startTime: this.normalizeTime(dto.startTime),
      endTime: this.normalizeTime(dto.endTime),
      status: BookingStatus.PENDING,
      price: dto.price ?? '0',
    });

    try {
      return await this.bookingRepository.save(booking);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException(
          'Já existe agendamento para esta quadra neste horário.',
        );
      }
      throw error;
    }
  }

  private normalizeTime(value: string): string {
    return value.length === 5 ? `${value}:00` : value;
  }
}
