import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { BlogService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private blogService: BlogService) {}
  @Get()
  getBlogs() {
    return this.blogService.getBlogs();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createblog(@Body() body: Prisma.BlogsCreateInput) {
    return this.blogService.createBlog(body);
  }

  @Get(':id')
  getSingleBlog(@Param('id') id: string) {
    return this.blogService.getSingleBlog({ id: +id });
  }

  @Patch(':id')
  updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: Prisma.BlogsCreateInput,
  ) {
    return this.blogService.updateBlog({ id: +id }, updateBlogDto);
  }

  @Delete(':id')
  deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteblog({ id: +id });
  }
}
