import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Department, DepartmentSchema } from 'src/departments/schemas/department.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';
import { Branch, BranchSchema } from 'src/branches/schemas/branch.schema';

import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Service.name, schema: ServiceSchema }
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
