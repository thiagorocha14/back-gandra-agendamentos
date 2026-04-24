import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetCourtsController } from './controller/get-courts.controller';
import { Court } from './entity/court.entity';
import { GetCourtsService } from './service/get-courts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Court])],
  controllers: [GetCourtsController],
  providers: [GetCourtsService],
  exports: [TypeOrmModule],
})
export class CourtsModule {}
