import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthSessionResponse } from './auth-payload';

@Injectable()
export class SignInService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: SignInDto): Promise<AuthSessionResponse> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase(), active: true },
    });
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      userType: user.userType,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
      },
    };
  }
}
