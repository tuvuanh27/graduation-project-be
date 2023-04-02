import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseDocument, BaseSchema, Prop } from '@libs/shared';

export type LatestBlockDocument = LatestBlock & BaseDocument;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
  virtuals: true,
})
export class LatestBlock extends BaseSchema {
  @Prop({ required: true, unique: true, type: String })
  queueName: string;

  @Prop({ required: true, type: Number })
  currentBlockNumber: number;

  @Prop({ default: 10, required: true, type: Number })
  blockPerProcess: number;
}

export const LatestBlockSchemaInstance =
  SchemaFactory.createForClass(LatestBlock);
