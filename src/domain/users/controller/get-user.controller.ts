import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../../auth/guard/admin-auth.guard';
import { User } from '../entity/user.entity';
import { GetUserService } from '../service/get-user.service';

@Controller('users')
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async getUser(@Param('id') id: string): Promise<Omit<User, 'passwordHash'>> {
    return this.getUserService.execute(id);
  }
}
