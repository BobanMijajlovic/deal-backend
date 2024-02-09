import {ArgumentsHost, Catch, HttpStatus} from '@nestjs/common';
import {PrismaClientKnownRequestError, PrismaClientValidationError} from "@prisma/client/runtime/library";
import {BaseExceptionFilter} from "@nestjs/core";

type TPrismaError = PrismaClientValidationError | PrismaClientKnownRequestError


@Catch(PrismaClientValidationError, PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(exception: TPrismaError, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const message = exception.message.replace(/\n/g, '');

        if (exception instanceof PrismaClientValidationError) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message
            })
        }


        if (exception instanceof PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2025':
                case 'P2016':
                    response.status(HttpStatus.NOT_FOUND).json({
                        statusCode: HttpStatus.NOT_FOUND,
                        message: "An operation failed because it depends on one or more records that were required but not found.",
                    });
            }
        }
        super.catch(exception, host);
    }
}
