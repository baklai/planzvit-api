import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArchivesController } from './archives.controller';
import { ArchivesService } from './archives.service';
import { Archive, ArchiveSchema } from './schemas/archive.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema }])],
  controllers: [ArchivesController],
  providers: [ArchivesService]
})
export class ArchivesModule {}
