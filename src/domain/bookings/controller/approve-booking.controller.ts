import {
  Controller,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthGuard, JwtAuthUser } from '../../auth/guard/admin-auth.guard';
import { Booking } from '../entity/booking.entity';
import { ApproveBookingService } from '../service/approve-booking.service';

@Controller('bookings')
export class ApproveBookingController {
  constructor(
    private readonly approveBookingService: ApproveBookingService,
  ) {}

  @Put('approve-booking/:id')
  @UseGuards(AdminAuthGuard)
  async approveBooking(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtAuthUser },
  ): Promise<Booking> {
    return this.approveBookingService.execute(id, req.user.id);
  }
}
