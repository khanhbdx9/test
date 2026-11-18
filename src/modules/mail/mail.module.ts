import { Module } from '@nestjs/common';
import { SystemConfigsModule } from '../system-configs/system-configs.module';
import { MailService } from './mail.service';

@Module({
  imports: [SystemConfigsModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
