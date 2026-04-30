import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookingBundleDto } from '../dto/update-booking-bundle.dto';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { persistBundleCoverImage } from '../util/persist-bundle-cover-image';

@Injectable()
export class UpdateBookingBundleService {
  constructor(
    @InjectRepository(BookingBundle)
    private readonly bookingBundleRepository: Repository<BookingBundle>,
  ) {}

  async execute(
    id: string,
    dto: UpdateBookingBundleDto,
    file?: { mimetype: string; originalname: string; buffer: Buffer },
  ): Promise<BookingBundle> {
    const bundle = await this.bookingBundleRepository.findOne({
      where: { id },
    });
    if (!bundle) {
      throw new NotFoundException('Pacote de agendamentos não encontrado.');
    }

    if (file) {
      bundle.coverImage = await persistBundleCoverImage(file);
    }
    if (dto.name !== undefined) {
      bundle.name = dto.name;
    }
    if (dto.description !== undefined) {
      bundle.description = dto.description;
    }
    if (dto.totalHours !== undefined) {
      bundle.totalHours = dto.totalHours;
    }
    if (dto.price !== undefined) {
      bundle.price = dto.price;
    }
    if (dto.active !== undefined) {
      bundle.active = dto.active;
    }

    return this.bookingBundleRepository.save(bundle);
  }
}
