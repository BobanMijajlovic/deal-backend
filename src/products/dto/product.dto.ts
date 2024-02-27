import {IsNumber, IsString, Length, Min, IsNotEmpty} from "class-validator";

export class ProductDto {
    @IsString()
    @Length(0,2)
    readonly title: string;
    @IsNumber()
    @Min(10)
    @IsNotEmpty()
    readonly price: number;
}
