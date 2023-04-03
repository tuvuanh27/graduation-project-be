import { CreatePendingNftDto } from '@app/modules/nft/dtos/create-pending-nft.dto';

export interface IKafkaPayload<T> {
  data: T;
  createdAt: number;
}

export class PendingNftKafkaPayload extends CreatePendingNftDto {
  image: string;
}
