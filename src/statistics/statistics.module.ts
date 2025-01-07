import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Department, DepartmentSchema } from 'src/departments/schemas/department.schema';
import { Profile, ProfileSchema } from 'src/profiles/schemas/profile.schema';
import { Syslog, SyslogSchema } from 'src/syslogs/schemas/syslog.schema';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Service, ServiceSchema } from 'src/services/schemas/service.schema';
import { Branch, BranchSchema } from 'src/branches/schemas/branch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Syslog.name, schema: SyslogSchema }
    ])
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService]
})
export class StatisticsModule {}
