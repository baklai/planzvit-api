import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Syslog, SyslogSchema } from './schemas/syslog.schema';
import { SyslogsController } from './syslogs.controller';
import { SyslogsService } from './syslogs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Syslog.name, schema: SyslogSchema }])],
  controllers: [SyslogsController],
  providers: [SyslogsService],
  exports: [SyslogsService]
})
export class SyslogsModule {}
