import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}
  getBlogs() {
    return this.prisma.blogs.findMany();
  }

  createBlog(createBlogDto: Prisma.BlogsCreateInput) {
    return this.prisma.blogs.create({
      data: createBlogDto,
    });
  }

  getSingleBlog(blogWhereUniqueInput: Prisma.BlogsWhereUniqueInput) {
    return this.prisma.blogs.findUnique({
      where: blogWhereUniqueInput,
    });
  }

  updateBlog(
    where: Prisma.BlogsWhereUniqueInput,
    data: Prisma.BlogsCreateInput,
  ) {
    return this.prisma.blogs.update({
      where,
      data,
    });
  }

  deleteblog(where: Prisma.BlogsWhereUniqueInput) {
    return this.prisma.blogs.delete({
      where,
    });
  }
}
