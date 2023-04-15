import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoggerService } from '@libs/shared';
import { IKafkaPayload, PendingNftKafkaPayload } from '@libs/kafka/types';
import { IpfsLibService } from '@libs/ipfs-lib';
import { instanceToPlain } from 'class-transformer';
import fetch from 'node-fetch';
import { NftPendingRepository } from '@libs/database/repositories/nft-pending.repository';
// import PinataClient from '@pinata/sdk';

import { ConfigService } from '@nestjs/config';
import { EEnvKey } from '@libs/configs/env.constant';
import { dynamicImport } from 'tsimportlib';

@Injectable()
export class UploaderService implements OnModuleInit {
  // private pinata: PinataClient;
  private client: any;
  constructor(
    private configService: ConfigService,
    private loggerService: LoggerService,
    private readonly ipfsService: IpfsLibService,
    private readonly nftPendingRepository: NftPendingRepository,
  ) {}
  private readonly logger = this.loggerService.getLogger(UploaderService.name);

  async onModuleInit() {
    // this.pinata = new PinataClient(
    //   this.configService.get(EEnvKey.PITANA_API_KEY),
    //   this.configService.get(EEnvKey.PITANA_API_SECRET),
    // );
    // import('nft.storage').then((module) => {
    //   this.client = new module.NFTStorage({
    //     token: this.configService.get(EEnvKey.NFT_STORAGE_KEY),
    //   });
    // });

    this.client = new (await dynamicImport('nft.storage', module)).NFTStorage({
      token: this.configService.get(EEnvKey.NFT_STORAGE_KEY),
    });
  }

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
        ? { attributes: instanceToPlain(payload.data.attributes) }
        : {}),
    };
    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const { cid: metadataCid } = await ipfsNode.add(metadataBuffer);

    await this.nftPendingRepository.updateNftPending(payload.data.id, {
      ipfsHash: metadataCid.toString(),
    });
  }

  // mint by using nft storage
  async mintNftByPitana(payload: IKafkaPayload<PendingNftKafkaPayload>) {
    const data = instanceToPlain(payload.data);
    this.logger.log(`[uploadIpfs] data: ${JSON.stringify(data)}`);

    const response = await fetch(data.image);
    const imageDataBuffer = await response.arrayBuffer();

    // upload image to ipfs
    const cid = await this.client.storeBlob(
      new (
        await dynamicImport('nft.storage', module)
      ).File([imageDataBuffer], 'image.png', { type: 'image/png' }),
    );
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
        ? { attributes: instanceToPlain(payload.data.attributes) }
        : {}),
    };
    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const metadataCid = await this.client.storeDirectory([
      new (
        await dynamicImport('nft.storage', module)
      ).File([metadataBuffer], 'metadata.json'),
    ]);

    await this.nftPendingRepository.updateNftPending(payload.data.id, {
      ipfsHash: `${metadataCid.toString()}/metadata.json`,
    });
  }
}
