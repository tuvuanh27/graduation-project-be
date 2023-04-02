import { Injectable } from '@nestjs/common';

@Injectable()
export class IpfsService {
  getHello(): string {
    return 'Hello World!';
  }
}
