import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Syslog, SyslogSchema } from 'src/syslogs/schemas/syslog.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';

import { Notice, NoticeSchema } from './schemas/notice.schema';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notice.name, schema: NoticeSchema },
      { name: Syslog.name, schema: SyslogSchema }
    ]),
    ProfilesModule
  ],
  controllers: [NoticesController],
  providers: [NoticesService]
})
export class NoticesModule {}
