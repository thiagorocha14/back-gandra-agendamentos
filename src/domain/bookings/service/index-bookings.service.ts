import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entity/booking.entity';

@Injectable()
export class IndexBookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async execute(): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { status: Not(BookingStatus.CANCELLED) },
      order: { bookingDate: 'DESC', startTime: 'DESC' },
    });
  }
}
