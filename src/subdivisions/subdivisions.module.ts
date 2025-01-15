import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Subdivision, SubdivisionSchema } from './schemas/subdivision.schema';
import { SubdivisionsController } from './subdivisions.controller';
import { SubdivisionsService } from './subdivisions.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subdivision.name, schema: SubdivisionSchema }])],
  controllers: [SubdivisionsController],
  providers: [SubdivisionsService]
})
export class SubdivisionsModule {}
