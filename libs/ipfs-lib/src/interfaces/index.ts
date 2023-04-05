import { ModuleMetadata, Type } from '@nestjs/common';

export interface IPFSModuleOptionsFactory {
  createIPFSOptions(): Promise<any> | any;
}

export interface IPFSModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IPFSModuleOptionsFactory>;
  useClass?: Type<IPFSModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<any> | any;
  inject?: any[];
  imports?: any[];
}
