import { Injectable } from '@nestjs/common';
import { LoggerService } from '@libs/shared';
import { IKafkaPayload, PendingNftKafkaPayload } from '@libs/kafka/types';
import { IpfsLibService } from '@libs/ipfs-lib';

@Injectable()
export class UploaderService {
  constructor(
    private loggerService: LoggerService,
    private readonly ipfsService: IpfsLibService,
  ) {}
  private readonly logger = this.loggerService.getLogger(UploaderService.name);

  getHello(metadata: any): string {
    this.logger.log(metadata.data);
    return 'Hello World!';
  }

  async uploadIpfs(payload: IKafkaPayload<PendingNftKafkaPayload>) {
    const { data } = payload;
    this.logger.log(`[uploadIpfs] data: ${JSON.stringify(data)}`);
    const ipfsNode = await this.ipfsService.getNode();
  }
}
