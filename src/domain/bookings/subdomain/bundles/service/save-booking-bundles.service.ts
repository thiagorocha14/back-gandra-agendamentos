import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Repository } from 'typeorm';
import { CreateBookingBundleDto } from '../dto/create-booking-bundle.dto';
import { BookingBundle } from '../entity/booking-bundle.entity';

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
    const coverImage = await this.persistCoverImage(file);

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

  private async persistCoverImage(file: {
    mimetype: string;
    originalname: string;
    buffer: Buffer;
  }): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Arquivo inválido: envie uma imagem.');
    }

    const uploadDirectory = join(process.cwd(), 'uploads', 'booking-bundles');
    await mkdir(uploadDirectory, { recursive: true });

    const safeExtension = extname(file.originalname) || '.jpg';
    const fileName = `bundle-cover-${Date.now()}${safeExtension}`;
    const destinationPath = join(uploadDirectory, fileName);

    await writeFile(destinationPath, file.buffer);
    return `/uploads/booking-bundles/${fileName}`;
  }
}
