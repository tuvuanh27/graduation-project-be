import { BaseDocument } from '@libs/shared/models';
import { BaseAggregateRoot } from '@libs/shared/cqrs';
import { IMapper } from './IMapper';
import { BaseSchema } from '@libs/shared/models';
import { EventPublisher } from '@nestjs/cqrs';

export class BaseMapper<
  Schema extends BaseSchema,
  TEntity extends BaseAggregateRoot<Schema, TDocument>,
  TDocument = Schema & BaseDocument,
  Response = any,
> implements IMapper<Schema, TEntity, TDocument, Response>
{
  constructor(protected readonly publisher: EventPublisher) {}

  toPersistence(entity: TEntity): TDocument {
    return entity.document;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toDomain(_record: TDocument): TEntity {
    throw new Error('Method not implemented.');
    // return new DomainAggregate(record._id, record);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toResponse(_entity: TEntity): Response {
    throw new Error('Method not implemented.');
  }
  toPersistencies(entities: TEntity[]): TDocument[] {
    return entities.map((entity) => entity.document);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toDomains(_records: TDocument[]): TEntity[] {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toResponses(_entities: TEntity[]): Response[] {
    throw new Error('Method not implemented.');
  }
}
