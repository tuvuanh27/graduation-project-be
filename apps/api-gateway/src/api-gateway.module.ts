import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { memoryStorage } from 'multer';
import { ConsoleModule } from 'nestjs-console';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';

import { ConfigurationModule } from '@libs/configs/config.module';
import { DatabaseModule } from '@libs/configs/database.module';

import { LoggingModule } from '@libs/shared/modules';

import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { MODULES } from './modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EEnvKey } from '@libs/configs/env.constant';
import { Web3Module } from '@libs/web3';
import { extname } from 'path';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    LoggingModule,
    ConsoleModule,
    ConfigModule,
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        debug: config.get<string>('SENTRY_DSN_DEBUG') === 'true',
        dsn: config.get<string>('SENTRY_DSN'),
        environment:
          config.get<string>('NODE_ENV') === 'development' ||
          config.get<string>('NODE_ENV') === 'debug'
            ? 'dev'
            : 'production',
        enabled: config.get<string>('SENTRY_DSN_ENABLED') === 'true',
        logLevels:
          config.get<string>('SENTRY_DSN_DEBUG') === 'true'
            ? ['debug']
            : ['log'],
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: memoryStorage(),
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
    ScheduleModule.forRoot(),
    Web3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>(EEnvKey.RPC_BSC_TESTNET_URL),
      }),
      inject: [ConfigService],
    }),
    ...MODULES,
  ],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) => {
                return 500 > exception.getStatus();
              },
            },
          ],
        }),
    },
  ],
})
export class ApiGatewayModule {}
