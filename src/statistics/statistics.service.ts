import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { count } from 'console';
import { Model } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { Profile } from 'src/profiles/schemas/profile.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Syslog } from 'src/syslogs/schemas/syslog.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    @InjectModel(Syslog.name) private readonly syslogModel: Model<Syslog>
  ) {}

  async dashboard() {
    const [departments, services] = await Promise.all([
      this.departmentModel.countDocuments(),
      this.serviceModel.countDocuments()
    ]);

    return {
      departments,
      services
    };
  }

  async database() {
    const [
      departmentsCount,
      servicesCount,
      branchesCount,
      subdivisionsCount,
      departmentChart,
      branchChart
    ] = await Promise.all([
      this.departmentModel.countDocuments(),
      this.serviceModel.countDocuments(),
      this.branchModel.countDocuments(),
      this.branchModel
        .aggregate([{ $unwind: '$subdivisions' }, { $count: 'count' }])
        .then(([{ count } = { count: 0 }]) => count),
      this.departmentModel.aggregate([
        {
          $project: {
            name: 1,
            servicesCount: { $size: { $ifNull: ['$services', []] } }
          }
        }
      ]),
      this.branchModel.aggregate([
        {
          $project: {
            name: 1,
            subdivisionsCount: { $size: { $ifNull: ['$subdivisions', []] } }
          }
        }
      ])
    ]);

    return {
      departmentsCount,
      servicesCount,
      branchesCount,
      subdivisionsCount,
      departmentChart,
      branchChart
    };
  }

  async datacore() {
    const [profiles] = await Promise.all([this.profileModel.countDocuments()]);

    return {
      profiles
    };
  }
}
