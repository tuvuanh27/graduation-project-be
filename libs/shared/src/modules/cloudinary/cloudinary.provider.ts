import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from '@libs/shared/modules/cloudinary/cloudinary.constants';
import { ConfigService } from '@nestjs/config';
import { EEnvKey } from '@libs/configs/env.constant';
import { Provider } from '@nestjs/common';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: async (configService: ConfigService): Promise<ConfigOptions> => {
    const config: ConfigOptions = {
      cloud_name: configService.get<string>(EEnvKey.CLOUDINARY_CLOUD_NAME),
      api_key: configService.get<string>(EEnvKey.CLOUDINARY_API_KEY),
      api_secret: configService.get<string>(EEnvKey.CLOUDINARY_API_SECRET),
    };
    await v2.config(config);
    return config;
  },
  inject: [ConfigService],
};
