import { Module } from '@nestjs/common';
import { CloudinaryProvider } from '@libs/shared/modules/cloudinary/cloudinary.provider';
import { CloudinaryService } from '@libs/shared/modules/cloudinary/cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
