import { Module, DynamicModule, Global, Provider, Type } from '@nestjs/common';
import { IPFSModuleOptionsFactory, IPFSModuleAsyncOptions } from './interfaces';
import { IpfsLibService } from '@libs/ipfs-lib/ipfs-lib.service';
import { IPFS_MODULE_OPTIONS } from '@libs/ipfs-lib/ipfs-lib.constants';

@Global()
@Module({})
export class IpfsLibModule {
  static register(options: any = {}, waitForNode = false): DynamicModule {
    return {
      module: IpfsLibModule,
      providers: [
        {
          provide: IPFS_MODULE_OPTIONS,
          useValue: options,
        },
        ...this.createIPFSService(waitForNode),
      ],
      exports: [IpfsLibService],
    };
  }

  static async registerAsync(
    options: IPFSModuleAsyncOptions,
    waitForNode = false,
  ): Promise<DynamicModule> {
    return {
      module: IpfsLibModule,
      imports: options.imports || [],
      providers: [
        ...this.createIPFSService(waitForNode),
        ...this.createIPFSProviders(options),
      ],
      exports: [IpfsLibService],
    };
  }

  private static createIPFSService(waitForNode: boolean): Provider[] {
    return waitForNode
      ? [
          {
            provide: IpfsLibService,
            useFactory: async (options) => {
              const service = new IpfsLibService(options);
              await service.getNode();
              return service;
            },
            inject: [IPFS_MODULE_OPTIONS],
          },
        ]
      : [IpfsLibService];
  }

  private static createIPFSProviders(
    options: IPFSModuleAsyncOptions,
  ): Provider[] {
    // If FactoryProvider or ExistingProvider use directly
    if (options.useFactory || options.useExisting) {
      return [this.createIPFSOptionsProviders(options)];
    }

    // If ClassProvider inject class and provider
    return [
      this.createIPFSOptionsProviders(options),
      {
        provide: options.useClass as Type<IPFSModuleOptionsFactory>,
        useClass: options.useClass as Type<IPFSModuleOptionsFactory>,
      },
    ];
  }

  private static createIPFSOptionsProviders(
    options: IPFSModuleAsyncOptions,
  ): Provider {
    // If FactoryProvider use the passed in factory
    if (options.useFactory) {
      return {
        provide: IPFS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // Create factory from ClassProvider or Existing Service
    return {
      provide: IPFS_MODULE_OPTIONS,
      useFactory: async (optionsFactory: IPFSModuleOptionsFactory) =>
        await optionsFactory.createIPFSOptions(),
      inject: [options.useExisting as Type<IPFSModuleOptionsFactory>] || [
        options.useClass as Type<IPFSModuleOptionsFactory>,
      ],
    };
  }
}
