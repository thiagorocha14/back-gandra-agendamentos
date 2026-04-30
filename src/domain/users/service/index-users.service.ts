import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class IndexUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(): Promise<Omit<User, 'passwordHash'>[]> {
    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        userType: true,
        active: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
