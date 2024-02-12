import {Injectable} from '@nestjs/common';
import {ProductDto} from 'src/products/dto/product.dto';
import {PrismaService} from "@app/prisma/prisma.service";
import {ProductUpdateDto} from "@app/products/dto/product_update.dto";
import {PaginationDto} from "@app/common/dto/pagination/Pagination.dto";


@Injectable()
export class ProductsService {

    constructor(
        private prisma: PrismaService
    ) {
    }


    create(createProductDto: ProductDto) {
        return this.prisma.product.create({
            data: createProductDto
        })
    }

    async findAll(pagination: PaginationDto) {


        const [data, count] = await Promise.all([
            this.prisma.product.findMany({
                ...PaginationDto.toPrismaPagination(pagination)
            }),
            this.prisma.product.count()
        ])
        return {
            data,
            meta: {
                total: count,
                ...pagination
            }
        }
    }

    findOne(id: number) {
        return this.prisma.product.findFirst({
            where: {
                id
            }
        })
    }

    update(id: number, updateProductDto: ProductUpdateDto) {
        return this.prisma.product.update({
            where: {
                id
            },
            data: updateProductDto
        })
    }

    async remove(id: number) {
        return this.prisma.deleteOne(id, 'product')
    }
}
