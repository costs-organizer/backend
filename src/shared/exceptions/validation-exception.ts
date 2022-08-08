import { HttpStatus } from '@nestjs/common';

export class ValidaionException {
  public readonly httpStatus: HttpStatus = HttpStatus.BAD_REQUEST;

  constructor(public readonly message?: any) {
    this.message = message ?? 'Something went wrong';
  }
}
