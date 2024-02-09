import {HttpCode, HttpStatus, Injectable, Post} from '@nestjs/common';
import { ProductDto } from 'src/products/dto/product.dto';
import {PrismaService} from "@app/prisma/prisma.service";


@Injectable()
export class ProductsService {

  constructor(
      private prisma: PrismaService
  ) {}


  create(createProductDto: ProductDto) {
    return this.prisma.product.create({
      data: createProductDto
    })
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: ProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
