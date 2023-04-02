import { Module } from '@nestjs/common';
import { KafkaModule } from '@libs/kafka';
import { NftController } from '@app/modules/nft/nft.controller';
import { NftService } from '@app/modules/nft/nft.service';

@Module({
  imports: [KafkaModule.register()],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
