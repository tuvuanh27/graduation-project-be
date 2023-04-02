import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '@libs/shared';
import { LatestBlock, LatestBlockDocument } from '@libs/database/entities';

@Injectable()
export class LatestBlockRepository extends BaseRepository {
  constructor(
    @InjectModel(LatestBlock.name)
    public latestBlockDocumentModel: Model<LatestBlockDocument>,
  ) {
    super();
  }

  async getLatestBlockNftCrawled(): Promise<LatestBlockDocument> {
    return this.latestBlockDocumentModel.findOne({}).exec();
  }

  async updateLatestBlockNftCrawled(
    queueName: string,
    block: number,
  ): Promise<LatestBlockDocument> {
    return this.latestBlockDocumentModel
      .findOneAndUpdate(
        { queueName },
        {
          currentBlockNumber: block,
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async createLatestBlockNftCrawled(
    latestBlockDocument: Partial<LatestBlockDocument>,
  ): Promise<LatestBlockDocument> {
    return this.latestBlockDocumentModel.create(latestBlockDocument);
  }
}
