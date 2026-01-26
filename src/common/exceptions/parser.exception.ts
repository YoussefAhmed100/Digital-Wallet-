import { BadRequestException } from "@nestjs/common";

export class  ParserException extends BadRequestException{
    constructor(
    public readonly bank: string,
    public readonly line: string,
    message = 'Invalid transaction format',
    ){
        super({
            message,
            bank,
            line

        })

    }
}