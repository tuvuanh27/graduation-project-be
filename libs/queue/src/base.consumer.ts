import { getQueueToken, OnGlobalQueueError, OnQueueFailed } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Job, Queue } from 'bull';
import { LoggerService } from '@libs/shared';
import { Logger } from 'log4js';
import { OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';

export abstract class BaseConsumer
  implements OnModuleInit, OnApplicationBootstrap
{
  private queue: Queue;
  protected logger: Logger;

  protected constructor(
    protected readonly moduleRef: ModuleRef,
    protected readonly configService: ConfigService,
    protected readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.getLogger(BaseConsumer.name);
  }

  abstract getQueueName(): string;

  async onModuleInit() {
    try {
      this.queue = this.moduleRef.get(getQueueToken(this.getQueueName()), {
        strict: false,
      });
      await this.queue.resume();
    } catch (error) {
      this.logger.error({ error }, `queue ${this.getQueueName()} get error`);
    }
  }

  async onApplicationBootstrap() {
    const isPaused = await this.queue.isPaused();

    isPaused && (await this.queue.resume());
  }

  @OnGlobalQueueError()
  async onGlobalQueueError(error: Error) {
    this.logger.error({ error: error }, 'onGlobalQueueError');
  }

  @OnQueueFailed()
  async handler(job: Job, err: Error) {
    this.logger.error({ bullJob: job, error: err }, 'handler queue error');

    // TODO: send error to sentry or other service
  }
}
