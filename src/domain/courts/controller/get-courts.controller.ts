import { Controller, Get } from '@nestjs/common';
import { Court } from '../entity/court.entity';
import { GetCourtsService } from '../service/get-courts.service';

@Controller('courts')
export class GetCourtsController {
  constructor(private readonly getCourtsService: GetCourtsService) {}

  @Get()
  async getCourts(): Promise<Court[]> {
    return this.getCourtsService.execute();
  }
}
