import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from '@nestjs/common';
import {PrismaClientValidationError} from "@prisma/client/runtime/library";
import {BaseExceptionFilter} from "@nestjs/core";



type TPrismaError = PrismaClientValidationError


@Catch(PrismaClientValidationError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter{
  catch(exception: TPrismaError, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const message = exception.message.replace(/\n/g, '');

    if(exception instanceof PrismaClientValidationError){
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message
      })
    }



    super.catch(exception, host);


  }
}
