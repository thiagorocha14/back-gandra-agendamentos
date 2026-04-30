import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../../auth/guard/admin-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entity/user.entity';
import { UpdateUserService } from '../service/update-user.service';

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.updateUserService.execute(id, dto);
  }
}
