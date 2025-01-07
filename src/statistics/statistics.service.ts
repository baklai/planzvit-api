import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Department } from 'src/departments/schemas/department.schema';
import { Profile } from 'src/profiles/schemas/profile.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Syslog } from 'src/syslogs/schemas/syslog.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    @InjectModel(Syslog.name) private readonly syslogModel: Model<Syslog>
  ) {}

  async dashboard() {
    const [departments, services] = await Promise.all([
      this.profileModel.countDocuments(),
      this.departmentModel.countDocuments(),
      this.serviceModel.countDocuments()
    ]);

    return {
      departments,
      services
    };
  }

  async database() {
    const [departments, services] = await Promise.all([
      this.profileModel.countDocuments(),
      this.departmentModel.countDocuments(),
      this.serviceModel.countDocuments()
    ]);

    return {
      departments,
      services
    };
  }

  async datacore() {
    const [profiles] = await Promise.all([this.profileModel.countDocuments()]);

    return {
      profiles
    };
  }
}
