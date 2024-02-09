import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseFilters} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from 'src/products/dto/product.dto';
import {Public} from "@app/common/decorators";
import {PrismaClientExceptionFilter} from "@app/common/filters";

@Public()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
 create(@Body() createProductDto: ProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: ProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
