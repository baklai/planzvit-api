import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Department, DepartmentSchema } from 'src/departments/schemas/department.schema';
import { Report, ReportSchema } from 'src/reports/schemas/report.schema';

import { Service, ServiceSchema } from './schemas/service.schema';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Report.name, schema: ReportSchema }
    ])
  ],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
