import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (dto.email !== undefined) {
      const email = dto.email.toLowerCase();
      const other = await this.userRepository.findOne({
        where: { email },
      });
      if (other && other.id !== id) {
        throw new ConflictException('E-mail já cadastrado.');
      }
      user.email = email;
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }
    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }
    if (dto.userType !== undefined) {
      user.userType = dto.userType;
    }
    if (dto.active !== undefined) {
      user.active = dto.active;
    }

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      active: user.active,
      createdAt: user.createdAt,
    };
  }
}
