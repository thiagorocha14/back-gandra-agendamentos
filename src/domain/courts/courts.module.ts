import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexCourtsController } from './controller/index-courts.controller';
import { Court } from './entity/court.entity';
import { IndexCourtsService } from './service/index-courts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Court])],
  controllers: [IndexCourtsController],
  providers: [IndexCourtsService],
  exports: [TypeOrmModule],
})
export class CourtsModule {}
