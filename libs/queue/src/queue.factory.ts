import { Injectable } from '@nestjs/common';
import { BullOptionsFactory } from '@nestjs/bull';
import { LoggerService } from '@libs/shared';
import { ConfigService } from '@nestjs/config';
import Bull from 'bull';
import * as Redis from 'ioredis';
import { EEnvKey } from '@libs/configs/env.constant';

@Injectable()
export class BullQueueOptionsFactory implements BullOptionsFactory {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  public createBullOptions(): Bull.QueueOptions {
    const option: Redis.RedisOptions = {
      host: this.configService.get<string>(EEnvKey.REDIS_HOST),
      port: this.configService.get<number>(EEnvKey.REDIS_PORT),
      // db: this.configService.get<number>(EEnvKey.REDIS_PASSWORD),
      // password: this.configService.get<string>(EEnvKey.REDIS_DB),
    };

    return {
      redis: option,
      defaultJobOptions: {
        removeOnFail: false,
        // remove after 1 day
        removeOnComplete: 86400,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    };
  }
}
