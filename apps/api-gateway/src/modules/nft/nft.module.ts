import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka';
import { NftController } from '@app/modules/nft/nft.controller';
import { NftService } from '@app/modules/nft/nft.service';
import { CloudinaryModule } from '@libs/shared/modules/cloudinary';

@Module({
  imports: [KafkaModule.register(), CloudinaryModule],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
