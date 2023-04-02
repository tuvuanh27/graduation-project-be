import { Module } from '@nestjs/common';
import { BullQueueOptionsFactory } from './queue.factory';
import { BullModule } from '@nestjs/bull';
import { CRAWLER_QUEUE } from '@libs/queue/bull-queue.constants';

@Module({
  imports: [
    BullModule.registerQueueAsync(
      ...[
        {
          name: CRAWLER_QUEUE,
          useClass: BullQueueOptionsFactory,
        },
      ],
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
