import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from '../entity/court.entity';

@Injectable()
export class IndexCourtsService {
  constructor(
    @InjectRepository(Court)
    private readonly courtRepository: Repository<Court>,
  ) {}

  async execute(): Promise<Court[]> {
    return this.courtRepository.find({
      where: { active: true },
      order: { id: 'ASC' },
    });
  }
}
