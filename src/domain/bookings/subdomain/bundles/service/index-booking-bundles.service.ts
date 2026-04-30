import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthUser } from '../../../../auth/guard/admin-auth.guard';
import { UserType } from '../../../../users/enum/user-type.enum';
import { BookingBundle } from '../entity/booking-bundle.entity';

@Injectable()
export class IndexBookingBundlesService {
  constructor(
    @InjectRepository(BookingBundle)
    private readonly bookingBundleRepository: Repository<BookingBundle>,
  ) {}

  async execute(user: JwtAuthUser): Promise<BookingBundle[]> {
    const isAdmin = user.userType === UserType.ADMIN;
    return this.bookingBundleRepository.find({
      where: isAdmin ? {} : { active: true },
      order: { price: 'ASC' },
    });
  }
}
