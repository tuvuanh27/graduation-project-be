import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { IPFS_MODULE_OPTIONS } from '@libs/ipfs-lib/ipfs-lib.constants';
import * as IpfsCore from 'ipfs-core';
import * as IPFS from 'ipfs';

@Injectable()
export class IpfsLibService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(IPFS_MODULE_OPTIONS) private _ipfsOptions: IpfsCore.Options,
  ) {}

  private _ipfsNode: IPFS.IPFS;

  async getNode(): Promise<IPFS.IPFS> {
    return this._ipfsNode;
  }

  async onModuleInit(): Promise<void> {
    this._ipfsNode = await IPFS.create(this._ipfsOptions);
  }

  async onApplicationShutdown(): Promise<void> {
    this._ipfsNode && (await this._ipfsNode.stop());
  }
}
