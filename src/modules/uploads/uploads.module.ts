import { Module } from '@nestjs/common';
import { IMAGE_STORAGE, UploadsService } from './uploads.service';
import { LocalImageStorage } from './local-image.storage';
import { UploadsController } from './uploads.controller';

@Module({
  controllers: [UploadsController],
  providers: [
    UploadsService,
    { provide: IMAGE_STORAGE, useClass: LocalImageStorage },
  ],
  exports: [UploadsService],
})
export class UploadsModule {}
