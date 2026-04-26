import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entity/booking.entity';

@Injectable()
export class CancelBookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async execute(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado.');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Este agendamento já está cancelado.');
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'Não é possível cancelar um agendamento concluído.',
      );
    }

    booking.status = BookingStatus.CANCELLED;

    return this.bookingRepository.save(booking);
  }
}
