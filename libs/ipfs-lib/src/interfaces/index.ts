import { ModuleMetadata, Type } from '@nestjs/common';
import * as IpfsCore from 'ipfs-core';

export interface IPFSModuleOptionsFactory {
  createIPFSOptions(): Promise<IpfsCore.Options> | IpfsCore.Options;
}

export interface IPFSModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IPFSModuleOptionsFactory>;
  useClass?: Type<IPFSModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<IpfsCore.Options> | IpfsCore.Options;
  inject?: any[];
  imports?: any[];
}
