import { Inject } from '@nestjs/common';
import { getRedisConnectionToken } from './redis-core.utils';

export const InjectRedis = (connection?: string) => {
  return Inject(getRedisConnectionToken(connection));
};
