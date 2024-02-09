import {IsNumber, IsString, Length, Min} from "class-validator";

export class ProductDto {
    readonly id: number
    @IsString()
    @Length(0,256)
    readonly title: string;
    @IsNumber()
    @Min(0)
    readonly price: number;
}
