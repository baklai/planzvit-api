import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Branch, BranchSchema } from 'src/branches/schemas/branch.schema';
import { Department, DepartmentSchema } from 'src/departments/schemas/department.schema';
import { Report, ReportSchema } from 'src/reports/schemas/report.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';

import { Sheet, SheetSchema } from './schemas/sheet.schema';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sheet.name, schema: SheetSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Report.name, schema: ReportSchema }
    ])
  ],
  controllers: [SheetsController],
  providers: [SheetsService]
})
export class SheetsModule {}
