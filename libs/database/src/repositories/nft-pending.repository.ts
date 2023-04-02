import { BaseRepository } from '@libs/shared';
import { InjectModel } from '@nestjs/mongoose';
import {
  NftPending,
  NftPendingDocument,
} from '@libs/database/entities/nft-pending.schema';
import { Model } from 'mongoose';

export class NftPendingRepository extends BaseRepository {
  constructor(
    @InjectModel(NftPending.name)
    public nftPendingDocumentModel: Model<NftPendingDocument>,
  ) {
    super();
  }

  async createNftPending(
    nftPendingDocument: Partial<NftPendingDocument>,
  ): Promise<NftPendingDocument> {
    return this.nftPendingDocumentModel.create(nftPendingDocument);
  }

  async updateNftPending(
    id: string,
    nftPendingDocument: Partial<NftPendingDocument>,
  ): Promise<NftPendingDocument> {
    return this.nftPendingDocumentModel
      .findByIdAndUpdate(id, nftPendingDocument, {
        new: true,
      })
      .exec();
  }
}
