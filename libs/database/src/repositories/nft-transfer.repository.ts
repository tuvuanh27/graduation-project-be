import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '@libs/shared';
import { NftTransfer, NftTransferDocument } from '@libs/database/entities';

@Injectable()
export class NftTransferRepository extends BaseRepository {
  constructor(
    @InjectModel(NftTransfer.name)
    public nftTransferDocumentModel: Model<NftTransferDocument>,
  ) {
    super();
  }

  async getNftTransferByTxHash(txHash: string): Promise<NftTransferDocument> {
    return this.nftTransferDocumentModel.findOne({ txHash }).exec();
  }

  async createNftTransfer(
    nftTransferDocument: Partial<NftTransferDocument>,
  ): Promise<NftTransferDocument> {
    return this.nftTransferDocumentModel.create(nftTransferDocument);
  }

  async getNftTransfersByTokenId(
    tokenId: string,
  ): Promise<NftTransferDocument[]> {
    return this.nftTransferDocumentModel
      .find({ tokenId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getTopNftTransfers(): Promise<{ _id: string; count: number }[]> {
    return this.nftTransferDocumentModel
      .aggregate([
        {
          $group: {
            _id: '$tokenId',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .exec();
  }

  async getNumberOfNftTransfers(
    nftIds: string[],
  ): Promise<{ _id: string; count: number }[]> {
    return this.nftTransferDocumentModel
      .aggregate([
        {
          $match: {
            tokenId: {
              $in: nftIds,
            },
          },
        },
        {
          $group: {
            _id: '$tokenId',
            count: { $sum: 1 },
          },
        },
      ])
      .exec();
  }
}
