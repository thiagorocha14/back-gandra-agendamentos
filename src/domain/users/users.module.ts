import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GetUserController } from './controller/get-user.controller';
import { IndexUsersController } from './controller/index-users.controller';
import { UpdateUserController } from './controller/update-user.controller';
import { User } from './entity/user.entity';
import { GetUserService } from './service/get-user.service';
import { IndexUsersService } from './service/index-users.service';
import { UpdateUserService } from './service/update-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [IndexUsersController, GetUserController, UpdateUserController],
  providers: [IndexUsersService, GetUserService, UpdateUserService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
