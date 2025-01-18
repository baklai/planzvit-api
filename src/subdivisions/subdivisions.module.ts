import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Branch, BranchSchema } from 'src/branches/schemas/branch.schema';
import { Report, ReportSchema } from 'src/reports/schemas/report.schema';

import { Subdivision, SubdivisionSchema } from './schemas/subdivision.schema';
import { SubdivisionsController } from './subdivisions.controller';
import { SubdivisionsService } from './subdivisions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subdivision.name, schema: SubdivisionSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Report.name, schema: ReportSchema }
    ])
  ],
  controllers: [SubdivisionsController],
  providers: [SubdivisionsService]
})
export class SubdivisionsModule {}
