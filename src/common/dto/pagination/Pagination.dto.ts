import {IsIn, IsInt, IsOptional, IsString, Min, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

class OrderByField {
    @IsIn(['asc', 'desc'], {message: 'Invalid order direction (asc | desc)'})
    direction: 'asc' | 'desc';

    @IsString()
    field: string
}

export class PaginationDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number = 10;


    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => OrderByField)
    orderBy?: OrderByField[];

    static toPrismaPagination(p: PaginationDto) {
        const orderBy = p.orderBy?.map((o) => ({[o.field]: o.direction}))
        return {
            skip: (+p.page - 1) * +p.pageSize,
            take: +p.pageSize,
            orderBy
        };
    }
}
