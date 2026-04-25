import { Controller, Get } from '@nestjs/common';
import { Court } from '../entity/court.entity';
import { IndexCourtsService } from '../service/index-courts.service';

@Controller('courts')
export class IndexCourtsController {
  constructor(private readonly indexCourtsService: IndexCourtsService) {}

  @Get()
  async indexCourts(): Promise<Court[]> {
    return this.indexCourtsService.execute();
  }
}
