import {IsNumber, IsString, Length, Min} from "class-validator";

export class ProductDto {
    @IsString()
    @Length(0,256)
    readonly title: string;
    @IsNumber()
    @Min(0)
    readonly price: number;
}
