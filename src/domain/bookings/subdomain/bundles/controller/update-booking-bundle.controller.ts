import {
  Body,
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from '../../../../auth/guard/admin-auth.guard';
import { UpdateBookingBundleDto } from '../dto/update-booking-bundle.dto';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { UpdateBookingBundleService } from '../service/update-booking-bundle.service';

@Controller('booking-bundles')
export class UpdateBookingBundleController {
  constructor(
    private readonly updateBookingBundleService: UpdateBookingBundleService,
  ) {}

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('coverImage'))
  async updateBookingBundle(
    @Param('id') id: string,
    @Body() dto: UpdateBookingBundleDto,
    @UploadedFile() file?: { mimetype: string; originalname: string; buffer: Buffer },
  ): Promise<BookingBundle> {
    return this.updateBookingBundleService.execute(id, dto, file);
  }
}
