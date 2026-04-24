import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entity/booking.entity';

@Injectable()
export class IndexBookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async execute(): Promise<Booking[]> {
    return this.bookingRepository.find({
      order: { bookingDate: 'DESC', startTime: 'DESC' },
    });
  }
}
