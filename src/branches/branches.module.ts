import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Report, ReportSchema } from 'src/reports/schemas/report.schema';

import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { Branch, BranchSchema } from './schemas/branch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Report.name, schema: ReportSchema }
    ])
  ],
  controllers: [BranchesController],
  providers: [BranchesService]
})
export class BranchesModule {}
