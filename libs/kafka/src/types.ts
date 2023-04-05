import { NftAttributes } from '@libs/database/entities';
import { Expose } from 'class-transformer';

export interface IKafkaPayload<T> {
  data: T;
  createdAt: number;
}

export class PendingNftKafkaPayload {
  id: string;
  name: string;
  description: string;
  image: string;
  externalUrl?: string;
  attributes?: NftAttributes[];
  isPublic: boolean;
  owner: string;
}
