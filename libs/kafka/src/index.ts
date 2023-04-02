export * from './kafka.module';
export * from './kafka.service';

export interface KafkaPayload<T> {
  value: {
    data: T;
    createdAt: number;
  };
  offset: string;
  timestamp: string;
  partition: number;
  topic: number;
}
