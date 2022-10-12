import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogService } from './blogs.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogService],
})
export class BlogModule {}
