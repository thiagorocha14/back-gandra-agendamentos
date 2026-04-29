import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../auth/guard/admin-auth.guard';
import { User } from '../entity/user.entity';
import { IndexUsersService } from '../service/index-users.service';

@Controller('users')
export class IndexUsersController {
  constructor(private readonly indexUsersService: IndexUsersService) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  async indexUsers(): Promise<Omit<User, 'passwordHash'>[]> {
    return this.indexUsersService.execute();
  }
}
