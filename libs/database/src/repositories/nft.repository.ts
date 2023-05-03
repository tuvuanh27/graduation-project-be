import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { BaseRepository } from '@libs/shared';
import { Nft, NftDocument } from '@libs/database/entities';

@Injectable()
export class NftRepository extends BaseRepository {
  constructor(
    @InjectModel(Nft.name)
    public nftDocumentModel: Model<NftDocument>,
  ) {
    super();
  }

  async createNft(nftDocument: Partial<NftDocument>): Promise<NftDocument> {
    return this.nftDocumentModel.create(nftDocument);
  }

  async updateNft(
    tokenId: string,
    nftDocument: Partial<NftDocument>,
  ): Promise<NftDocument> {
    return this.nftDocumentModel
      .findOneAndUpdate({ tokenId: nftDocument.tokenId }, nftDocument, {
        new: true,
      })
      .exec();
  }

  async updateOwnerNft(tokenId: string, owner: string) {
    return this.nftDocumentModel
      .updateOne({ tokenId }, { owner }, { new: true })
      .exec();
  }

  async updateNftPublic(tokenId: string, isPublic: boolean) {
    return this.nftDocumentModel.updateOne({ tokenId }, { isPublic }).exec();
  }

  async updateNftViewers(tokenId: string, viewers: string[]) {
    return this.nftDocumentModel.updateOne({ tokenId }, { viewers }).exec();
  }

  async getNftsByOwner(
    owner: string,
    filter?: FilterQuery<NftDocument>,
  ): Promise<NftDocument[]> {
    return this.nftDocumentModel
      .find({ owner, ...filter })
      .sort({ price: -1 })
      .exec();
  }

  getPublicNft() {
    return this.nftDocumentModel.find({ isPublic: true }).exec();
  }

  getNftByTokenIds(
    tokenIds: string[],
    address: string,
  ): Promise<NftDocument[]> {
    // with each tokenId, check if it is public or viewers must include the address or the owner is the address
    return this.nftDocumentModel
      .find({
        $or: [
          {
            tokenId: { $in: tokenIds },
            isPublic: true,
          },
          {
            tokenId: { $in: tokenIds },
            viewers: { $in: [address] },
          },
          {
            tokenId: { $in: tokenIds },
            owner: address,
          },
        ],
      })
      .exec();
  }

  async searchNftOnchain(q: string) {
    return this.nftDocumentModel
      .find({
        $text: { $search: q },
        isPublic: true,
      })
      .exec();
  }

  async updateNftPrice(tokenId: string, price: string) {
    return this.nftDocumentModel
      .findOneAndUpdate({ tokenId }, { price }, { new: true })
      .exec();
  }

  async getNftOnSale() {
    return this.nftDocumentModel
      .find({ price: { $gt: 0 } })
      .sort({ price: 1 })
      .exec();
  }

  async getListNftByTokenIds(tokenIds: string[]): Promise<NftDocument[]> {
    return this.nftDocumentModel.find({ tokenId: { $in: tokenIds } }).exec();
  }
}
