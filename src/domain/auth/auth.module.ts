import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { SignInController } from './controller/sign-in.controller';
import { SignUpController } from './controller/sign-up.controller';
import { SignInService } from './service/sign-in.service';
import { SignUpService } from './service/sign-up.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminAuthGuard } from './guard/admin-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  controllers: [SignInController, SignUpController],
  exports: [JwtStrategy, AdminAuthGuard, JwtAuthGuard],
  providers: [SignInService, SignUpService, JwtStrategy, AdminAuthGuard, JwtAuthGuard],
})
export class AuthModule {}
