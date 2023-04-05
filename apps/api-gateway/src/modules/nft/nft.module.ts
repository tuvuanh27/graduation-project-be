import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka';
import { NftController } from '@app/modules/nft/nft.controller';
import { NftService } from '@app/modules/nft/nft.service';
import { CloudinaryModule } from '@libs/shared/modules/cloudinary';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Nft,
  NftSchemaInstance,
  NftTransfer,
  NftTransferSchemaInstance,
} from '@libs/database/entities';
import {
  NftPending,
  NftPendingSchemaInstance,
} from '@libs/database/entities/nft-pending.schema';
import { NftRepository } from '@libs/database/repositories/nft.repository';
import { NftPendingRepository } from '@libs/database/repositories/nft-pending.repository';
import { NftTransferRepository } from '@libs/database/repositories/nft-transfer.repository';

@Module({
  imports: [
    KafkaModule.register(),
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Nft.name,
        schema: NftSchemaInstance,
      },
      {
        name: NftPending.name,
        schema: NftPendingSchemaInstance,
      },
      {
        name: NftTransfer.name,
        schema: NftTransferSchemaInstance,
      },
    ]),
  ],
  controllers: [NftController],
  providers: [
    NftService,
    NftRepository,
    NftPendingRepository,
    NftTransferRepository,
  ],
})
export class NftModule {}
