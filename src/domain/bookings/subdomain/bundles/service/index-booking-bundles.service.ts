import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingBundle } from '../entity/booking-bundle.entity';

@Injectable()
export class IndexBookingBundlesService {
  constructor(
    @InjectRepository(BookingBundle)
    private readonly bookingBundleRepository: Repository<BookingBundle>,
  ) {}

  async execute(): Promise<BookingBundle[]> {
    return this.bookingBundleRepository.find({
      order: { price: 'ASC' },
    });
  }
}
