import { Injectable } from '@nestjs/common';
import { LoggerService } from '@libs/shared';
import { IKafkaPayload, PendingNftKafkaPayload } from '@libs/kafka/types';
import { IpfsLibService } from '@libs/ipfs-lib';
import { instanceToPlain } from 'class-transformer';
import fetch from 'node-fetch';
import { NftPendingRepository } from '@libs/database/repositories/nft-pending.repository';

@Injectable()
export class UploaderService {
  constructor(
    private loggerService: LoggerService,
    private readonly ipfsService: IpfsLibService,
    private readonly nftPendingRepository: NftPendingRepository,
  ) {}
  private readonly logger = this.loggerService.getLogger(UploaderService.name);

  getHello(metadata: any): string {
    console.log(metadata);
    return 'Hello Kafka!';
  }

  async mintNft(payload: IKafkaPayload<PendingNftKafkaPayload>) {
    const data = instanceToPlain(payload.data);
    this.logger.log(`[uploadIpfs] data: ${JSON.stringify(data)}`);

    const response = await fetch(data.image);
    const imageDataBuffer = await response.arrayBuffer();

    const ipfsNode = await this.ipfsService.getNode();
    // upload image to ipfs
    const { cid } = await ipfsNode.add(imageDataBuffer);
    const imageIpfsUrl = `https://ipfs.io/ipfs/${cid.toString()}`;
    this.logger.log(`[uploadIpfs] imageIpfsUrl: ${imageIpfsUrl}`);

    // upload metadata to ipfs
    const metadata = {
      name: payload.data.name,
      description: payload.data.description,
      image: imageIpfsUrl,
      ...(payload.data.externalUrl
        ? { external_url: payload.data.externalUrl }
        : {}),
      ...(payload.data.attributes
        ? { attributes: payload.data.attributes }
        : {}),
    };
    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const { cid: metadataCid } = await ipfsNode.add(metadataBuffer);

    await this.nftPendingRepository.updateNftPending(payload.data.id, {
      ipfsHash: metadataCid.toString(),
    });
  }
}
