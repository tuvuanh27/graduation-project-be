// get address from header and pass it to req.address

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AddressInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const address = req.headers['address'] as string;
    if (address) {
      req.address = address;
    } else {
      req.address = '0x43090c7AC27A6Dbf23916457bdA0892CB5c31B38';
    }
    return next.handle();
  }
}
