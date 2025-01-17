import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Archive, ArchiveSchema } from 'src/archives/schemas/archive.schema';
import { Branch, BranchSchema } from 'src/branches/schemas/branch.schema';
import { Department, DepartmentSchema } from 'src/departments/schemas/department.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';
import { Subdivision, SubdivisionSchema } from 'src/subdivisions/schemas/subdivision.schema';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report, ReportSchema } from './schemas/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Subdivision.name, schema: SubdivisionSchema },
      { name: Archive.name, schema: ArchiveSchema },
      { name: Report.name, schema: ReportSchema }
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
