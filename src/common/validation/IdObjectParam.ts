import { IsNumberString } from 'class-validator';

export class IdObjectParam {
    @IsNumberString()
    id: number;
}
