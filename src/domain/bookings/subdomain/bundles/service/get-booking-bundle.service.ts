import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingBundle } from '../entity/booking-bundle.entity';

@Injectable()
export class GetBookingBundleService {
  constructor(
    @InjectRepository(BookingBundle)
    private readonly bookingBundleRepository: Repository<BookingBundle>,
  ) {}

  async execute(id: string): Promise<BookingBundle> {
    const bundle = await this.bookingBundleRepository.findOne({
      where: { id },
    });
    if (!bundle) {
      throw new NotFoundException('Pacote de agendamentos não encontrado.');
    }
    return bundle;
  }
}
