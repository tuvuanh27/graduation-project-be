import { KafkaOptions, Transport } from '@nestjs/microservices';

export const getKafkaClientOptions = (
  groupId: string,
  clientId: string,
  brokers: string[],
): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: clientId,
      brokers: brokers,
    },
    consumer: {
      groupId: groupId,
      allowAutoTopicCreation: true,
    },
    subscribe: {
      fromBeginning: true,
    },
    run: {
      autoCommit: true,
    },
    producerOnlyMode: true,
  },
});

export const getKafkaServerOptions = (
  groupId: string,
  clientId: string,
  brokers: string[],
): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: clientId,
      brokers: brokers,
    },
    consumer: {
      groupId: groupId,
      allowAutoTopicCreation: true,
      retry: {
        restartOnFailure: () => Promise.resolve(true),
      },
    },
    subscribe: {
      fromBeginning: true,
    },
    run: {
      autoCommit: true,
    },
  },
});
