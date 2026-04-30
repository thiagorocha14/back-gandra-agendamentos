import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { UserType } from '../../users/enum/user-type.enum';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthSessionResponse } from './auth-payload';

@Injectable()
export class SignUpService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: SignUpDto): Promise<AuthSessionResponse> {
    const email = dto.email.toLowerCase();
    const existing = await this.userRepository.findOne({
      where: { email },
    });
    if (existing) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      name: dto.name,
      email,
      phone: dto.phone ?? null,
      passwordHash,
      userType: UserType.REGULAR,
      active: true,
    });
    await this.userRepository.save(user);

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
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
