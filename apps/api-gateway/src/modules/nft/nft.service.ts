import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '@libs/kafka';
import { BadRequestException, LoggerService } from '@libs/shared';
import { Web3Service } from '@libs/web3';
import Web3 from 'web3';
import { CreatePendingNftDto } from '@app/modules/nft/dtos/create-pending-nft.dto';
import { CloudinaryService } from '@libs/shared/modules/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { KafkaTopic } from '@libs/kafka/constants';
import { INftAttributes, PendingNftKafkaPayload } from '@libs/kafka/types';
import { NftRepository } from '@libs/database/repositories/nft.repository';
import { NftPendingRepository } from '@libs/database/repositories/nft-pending.repository';
import { NftAttributes, NFTMetadata } from '@libs/database/entities';
import { UpdatePendingNftDto } from '@app/modules/nft/dtos/update-pending-nft.dto';
import { instanceToInstance, instanceToPlain } from 'class-transformer';
import { NftPendingDocument } from '@libs/database/entities/nft-pending.schema';

@Injectable()
export class NftService implements OnModuleInit {
  private web3: Web3;

  constructor(
    private readonly kafkaService: KafkaService,
    private loggerService: LoggerService,
    private web3Service: Web3Service,
    private readonly cloudinaryService: CloudinaryService,
    private readonly nftRepository: NftRepository,
    private readonly nftPendingRepository: NftPendingRepository,
  ) {}

  private readonly logger = this.loggerService.getLogger(NftService.name);

  async onModuleInit() {
    this.logger.log('NftService initialized');
    this.web3 = this.web3Service.getClient();
  }

  async testKafka(): Promise<void> {
    await this.kafkaService.send(KafkaTopic.TOPIC_TEST, {
      data: 'test kafka',
      createdAt: Date.now(),
    });
    this.logger.log('test kafka');
    return;
  }

  async createPending(
    pendingNft: CreatePendingNftDto,
    file: Express.Multer.File,
    address: string,
  ) {
    try {
      const uploadedImage: UploadApiResponse =
        await this.cloudinaryService.uploadImage(file);
      const { secure_url: secureUrl } = uploadedImage;

      const metadata: NFTMetadata = {
        name: pendingNft.name,
        description: pendingNft.description,
        image: secureUrl,
      };
      pendingNft.externalUrl && (metadata.externalUrl = pendingNft.externalUrl);
      pendingNft.attributes && (metadata.attributes = pendingNft.attributes);

      return this.nftPendingRepository.createNftPending({
        uri: secureUrl,
        isPublic: !!pendingNft.isPublic,
        owner: address,
        metadata,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({ message: error.message });
    }
  }

  async createNftOnChain(nftPendingId: string) {
    // TODO: move it to queue
    try {
      const pendingNft: NftPendingDocument =
        await this.nftPendingRepository.getNftPendingById(nftPendingId);
      if (!pendingNft) {
        throw new BadRequestException({ message: 'Nft pending not found' });
      }

      const attributes: INftAttributes[] = [];

      if (pendingNft.metadata.attributes) {
        pendingNft.metadata.attributes.forEach((attr) => {
          attributes.push({
            trait_type: attr.traitType,
            value: attr.value,
          });
        });
      }

      await this.kafkaService.send<PendingNftKafkaPayload>(
        KafkaTopic.PENDING_NFT,
        {
          data: {
            id: pendingNft._id,
            name: pendingNft.metadata.name,
            description: pendingNft.metadata.description,
            image: pendingNft.uri,
            isPublic: pendingNft.isPublic,
            owner: pendingNft.owner,
            ...(pendingNft.metadata.externalUrl
              ? { externalUrl: pendingNft.metadata.externalUrl }
              : {}),
            ...(attributes.length > 0
              ? {
                  attributes,
                }
              : {}),
          },
          createdAt: Date.now(),
        },
      );
      return true;
    } catch (error) {
      this.logger.error(`[createNftOnChain] ${error.message}`);
      throw new BadRequestException({ message: error.message });
    }
  }

  getListPendingNftByOwner(address: string) {
    return this.nftPendingRepository.getNftPendingByOwner(address);
  }

  getListReadyNftByOwner(address: string) {
    return this.nftPendingRepository.getNftReadyByOwner(address);
  }

  async getListNft(tokenIds: string[], address: string) {
    return this.nftRepository.getNftByTokenIds(tokenIds, address);
  }

  getPublicNft(q: string) {
    if (q) return this.nftRepository.searchNftOnchain(q);
    return this.nftRepository.getPublicNft();
  }

  async getNftsByOwner(owner: string) {
    return this.nftRepository.getNftsByOwner(owner);
  }

  async updateNft(
    pendingId: string,
    data: UpdatePendingNftDto,
    address: string,
  ) {
    // check owner
    const pendingNft = await this.nftPendingRepository.getNftPendingById(
      pendingId,
    );
    if (pendingNft.owner !== address) {
      throw new BadRequestException({ message: 'Not authorized' });
    }

    return this.nftPendingRepository.updateNftPending(pendingId, data);
  }

  async searchNftOnchain(q: string) {
    // full text search in nft name or nft description of all public nft
    return this.nftRepository.searchNftOnchain(q);
  }

  async deletePendingNft(pendingId: string, address: string) {
    // check owner
    const pendingNft = await this.nftPendingRepository.getNftPendingById(
      pendingId,
    );
    if (pendingNft.owner !== address) {
      throw new BadRequestException({ message: 'Not authorized' });
    }

    return this.nftPendingRepository.deleteNftPending(pendingId);
  }
}
