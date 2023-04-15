export interface IKafkaPayload<T> {
  data: T;
  createdAt: number;
}

export interface INftAttributes {
  trait_type?: string;
  value?: string;
}

export class PendingNftKafkaPayload {
  id: string;
  name: string;
  description: string;
  image: string;
  externalUrl?: string;
  attributes?: INftAttributes[];
  isPublic: boolean;
  owner: string;
}
