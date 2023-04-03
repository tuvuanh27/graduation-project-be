import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '@libs/kafka';
import { BadRequestException, LoggerService } from '@libs/shared';
import { Web3Service } from '@libs/web3';
import Web3 from 'web3';
import { CreatePendingNftDto } from '@app/modules/nft/dtos/create-pending-nft.dto';
import { CloudinaryService } from '@libs/shared/modules/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { KafkaTopic } from '@libs/kafka/constants';
import { PendingNftKafkaPayload } from '@libs/kafka/types';

@Injectable()
export class NftService implements OnModuleInit {
  private web3: Web3;
  constructor(
    private readonly kafkaService: KafkaService,
    private loggerService: LoggerService,
    private web3Service: Web3Service,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  private readonly logger = this.loggerService.getLogger(NftService.name);

  async onModuleInit() {
    this.logger.log('NftService initialized');
    this.web3 = this.web3Service.getClient();
  }

  async testKafka(data: CreatePendingNftDto): Promise<void> {
    await this.kafkaService.send(KafkaTopic.TOPIC_TEST, {
      data: data,
      createdAt: Date.now(),
    });
    this.logger.log('test kafka');
    return;
  }

  async uploadNft(pendingNft: CreatePendingNftDto, file: Express.Multer.File) {
    // TODO: move it to queue
    try {
      const uploadedImage: UploadApiResponse =
        await this.cloudinaryService.uploadImage(file);
      const { secure_url: secureUrl } = uploadedImage;

      await this.kafkaService.send<PendingNftKafkaPayload>(
        KafkaTopic.PENDING_NFT,
        {
          data: {
            ...pendingNft,
            image: secureUrl,
          },
          createdAt: Date.now(),
        },
      );

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({ message: error.message });
    }
  }
}
