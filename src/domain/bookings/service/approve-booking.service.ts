import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entity/booking.entity';

@Injectable()
export class ApproveBookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async execute(bookingId: string, adminUserId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado.');
    }
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Somente agendamentos pendentes podem ser aprovados.',
      );
    }

    booking.status = BookingStatus.APPROVED;
    booking.approvedBy = adminUserId;
    booking.approvedAt = new Date();

    return this.bookingRepository.save(booking);
  }
}
