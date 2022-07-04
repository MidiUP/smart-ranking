import { HttpException, HttpStatus } from '@nestjs/common';

export const serverError = (err: Error): HttpException => {
  throw new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: err.message,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
