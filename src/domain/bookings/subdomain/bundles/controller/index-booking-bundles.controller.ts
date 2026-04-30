import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../../auth/guard/jwt-auth.guard';
import { JwtAuthUser } from '../../../../auth/guard/admin-auth.guard';
import { BookingBundle } from '../entity/booking-bundle.entity';
import { IndexBookingBundlesService } from '../service/index-booking-bundles.service';

@Controller('booking-bundles')
export class IndexBookingBundlesController {
  constructor(
    private readonly indexBookingBundlesService: IndexBookingBundlesService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async indexBookingBundles(
    @Req() req: Request & { user: JwtAuthUser },
  ): Promise<BookingBundle[]> {
    return this.indexBookingBundlesService.execute(req.user);
  }
}
