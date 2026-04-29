import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBookingBundleDto } from '../dto/create-booking-bundle.dto';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { SaveBookingBundlesService } from '../service/save-booking-bundles.service';
import { AdminAuthGuard } from '../../../../auth/guard/admin-auth.guard';

@Controller('booking-bundles')
export class SaveBookingBundlesController {
  constructor(
    private readonly saveBookingBundlesService: SaveBookingBundlesService,
  ) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('coverImage'))
  async saveBookingBundle(
    @Body() dto: CreateBookingBundleDto,
    @UploadedFile() file?: { mimetype: string; originalname: string; buffer: Buffer },
  ): Promise<BookingBundle> {
    if (!file) {
      throw new BadRequestException('A imagem de capa é obrigatória.');
    }

    return this.saveBookingBundlesService.execute(dto, file);
  }
}
