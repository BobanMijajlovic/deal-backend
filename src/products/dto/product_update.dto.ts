import {IsNumber, IsOptional, IsString, Length, Min} from "class-validator";

export class ProductUpdateDto {
    @IsOptional()
    @IsString()
    @Length(0,256)
    readonly title?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly price?: number;
}
