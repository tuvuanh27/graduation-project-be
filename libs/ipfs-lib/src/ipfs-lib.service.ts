import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { IPFS_MODULE_OPTIONS } from '@libs/ipfs-lib/ipfs-lib.constants';
// import * as IpfsCore from 'ipfs-core';
import { dynamicImport } from 'tsimportlib';

@Injectable()
export class IpfsLibService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(IPFS_MODULE_OPTIONS)
    private _ipfsOptions: any,
  ) {}

  private _ipfsNode: any;

  async getNode(): Promise<any> {
    return this._ipfsNode;
  }
  async onModuleInit(): Promise<void> {
    // f*ck ipfs, it doesn't work with commonjs, so we have to use dynamic import
    // But don't have typescript support, so we have to use any
    this._ipfsNode = (await dynamicImport('ipfs', module)).create(
      this._ipfsOptions,
    );
  }

  async onApplicationShutdown(): Promise<void> {
    this._ipfsNode && (await this._ipfsNode.stop());
  }
}
