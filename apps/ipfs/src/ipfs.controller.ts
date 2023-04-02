import { Controller, Get } from '@nestjs/common';
import { IpfsService } from './ipfs.service';

@Controller()
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Get()
  getHello(): string {
    return this.ipfsService.getHello();
  }
}
