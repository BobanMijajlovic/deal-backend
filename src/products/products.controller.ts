import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post} from '@nestjs/common';
import {ProductsService} from './products.service';
import {ProductDto} from 'src/products/dto/product.dto';
import {Public} from "@app/common/decorators";
import {IdObjectParam} from "@app/common/validation/IdObjectParam";
import {ProductUpdateDto} from "@app/products/dto/product_update.dto";

@Public()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

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
    findOne(@Param() params: IdObjectParam) {
        return this.productsService.findOne(+params.id);
    }

    @Patch(':id')
    update(@Param() params: IdObjectParam, @Body() updateProductDto: ProductUpdateDto) {
        return this.productsService.update(+params.id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param() params: IdObjectParam) {
        return this.productsService.remove(+params.id);
    }
}
