import { Module } from '@nestjs/common';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';

@Module({
  imports: [],
  controllers: [IpfsController],
  providers: [IpfsService],
})
export class IpfsModule {}