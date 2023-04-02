import { Injectable } from '@nestjs/common';
import { LoggerService } from '@libs/shared';

@Injectable()
export class UploaderService {
  constructor(private loggerService: LoggerService) {}
  private readonly logger = this.loggerService.getLogger(UploaderService.name);

  getHello(metadata: any): string {
    this.logger.log(metadata.data);
    return 'Hello World!';
  }
}
