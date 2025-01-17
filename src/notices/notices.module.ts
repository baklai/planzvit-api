import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesModule } from 'src/profiles/profiles.module';
import { Profile, ProfileSchema } from 'src/profiles/schemas/profile.schema';
import { Syslog, SyslogSchema } from 'src/syslogs/schemas/syslog.schema';

import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { Notice, NoticeSchema } from './schemas/notice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notice.name, schema: NoticeSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Syslog.name, schema: SyslogSchema }
    ]),
    ProfilesModule
  ],
  controllers: [NoticesController],
  providers: [NoticesService]
})
export class NoticesModule {}
