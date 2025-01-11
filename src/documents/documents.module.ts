import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Branch, BranchSchema } from 'src/branches/schemas/branch.schema';
import { Department, DepartmentSchema } from 'src/departments/schemas/department.schema';
import { Report, ReportSchema } from 'src/reports/schemas/report.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';

import { Document, DocumentSchema } from './schemas/document.schema';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Report.name, schema: ReportSchema }
    ])
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentsModule {}
