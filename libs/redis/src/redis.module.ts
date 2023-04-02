import { ULTRA_CACHE } from '@libs/redis/constants';
import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from '@libs/redis/redis-core';
import { RedisCoreModule } from '@libs/redis/redis-core/redis-core.module';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EEnvKey } from '@libs/configs/env.constant';
import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
} from '@libs/redis/redis-core/redis-core.constants';

@Module({})
export class RedisModule {
  static registerAsync(connection?: string): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        RedisCoreModule.forRootAsync(
          {
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const redisConfig: RedisModuleOptions = {
                config: {
                  host: configService.get<string>(EEnvKey.REDIS_HOST),
                  port: configService.get<number>(EEnvKey.REDIS_PORT),
                  password: configService.get<string>(EEnvKey.REDIS_PASSWORD),
                  db: configService.get<number>(EEnvKey.REDIS_DB),
                },
              };
              return redisConfig;
            },
          },
          connection ||
            `${REDIS_MODULE_CONNECTION}_${REDIS_MODULE_CONNECTION_TOKEN}`,
        ),
      ],
      exports: [RedisCoreModule],
    };
  }

  public static forRoot(
    options: RedisModuleOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRoot(options, connection)],
      exports: [RedisCoreModule],
    };
  }

  public static forRootAsync(
    options: RedisModuleAsyncOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(options, connection)],
      exports: [RedisCoreModule],
    };
  }
}
