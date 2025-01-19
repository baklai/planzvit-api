import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Branch, BranchSchema } from 'src/branches/schemas/branch.schema';
import { Department, DepartmentSchema } from 'src/departments/schemas/department.schema';
import { Profile, ProfileSchema } from 'src/profiles/schemas/profile.schema';
import { Report, ReportSchema } from 'src/reports/schemas/report.schema';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';
import { Subdivision, SubdivisionSchema } from 'src/subdivisions/schemas/subdivision.schema';
import { Syslog, SyslogSchema } from 'src/syslogs/schemas/syslog.schema';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Subdivision.name, schema: SubdivisionSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Report.name, schema: ReportSchema },
      { name: Syslog.name, schema: SyslogSchema }
    ])
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule {}
