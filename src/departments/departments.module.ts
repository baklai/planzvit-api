import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Branch, BranchSchema } from 'src/branches/schemas/branch.schema';
import { Report, ReportSchema } from 'src/reports/schemas/report.schema';

import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department, DepartmentSchema } from './schemas/department.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Report.name, schema: ReportSchema }
    ])
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService]
})
export class DepartmentsModule {}
