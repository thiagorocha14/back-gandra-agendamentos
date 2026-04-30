import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingBundleDto } from '../dto/create-booking-bundle.dto';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { persistBundleCoverImage } from '../util/persist-bundle-cover-image';

@Injectable()
export class SaveBookingBundlesService {
  constructor(
    @InjectRepository(BookingBundle)
    private readonly bookingBundleRepository: Repository<BookingBundle>,
  ) {}

  async execute(
    dto: CreateBookingBundleDto,
    file: { mimetype: string; originalname: string; buffer: Buffer },
  ): Promise<BookingBundle> {
    const coverImage = await persistBundleCoverImage(file);

    const bookingBundle = this.bookingBundleRepository.create({
      name: dto.name,
      description: dto.description,
      coverImage,
      totalHours: dto.totalHours,
      price: dto.price,
      active: dto.active ?? true,
    });

    return this.bookingBundleRepository.save(bookingBundle);
  }
}
