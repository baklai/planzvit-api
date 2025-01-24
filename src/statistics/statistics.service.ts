import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { Profile } from 'src/profiles/schemas/profile.schema';
import { Report } from 'src/reports/schemas/report.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Subdivision } from 'src/subdivisions/schemas/subdivision.schema';
import { Syslog } from 'src/syslogs/schemas/syslog.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Subdivision.name) private readonly subdivisionModel: Model<Subdivision>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
    @InjectModel(Syslog.name) private readonly syslogModel: Model<Syslog>
  ) {}

  private getStartAndEndDateOfWeek = (date: Date) => {
    const firstDayOfWeek = 1;
    const day = date.getDay();
    const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  async dashboard() {
    const [
      departmentsCount,
      servicesCount,
      branchesCount,
      subdivisionsCount,
      servicesInDepartmentsCount,
      subdivisionsInBranchesCount,
      departmentChart,
      branchChart,
      departmentReportChart,
      branchReportChart
    ] = await Promise.all([
      this.departmentModel.countDocuments(),
      this.serviceModel.countDocuments(),
      this.branchModel.countDocuments(),
      this.subdivisionModel.countDocuments(),
      this.departmentModel
        .aggregate([{ $unwind: '$services' }, { $count: 'count' }])
        .then(([{ count } = { count: 0 }]) => count),
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
      ]),
      this.reportModel.aggregate([
        {
          $group: {
            _id: {
              department: '$department'
            },
            currentJobCount: {
              $sum: { $ifNull: ['$currentJobCount', 0] }
            }
          }
        },
        {
          $match: {
            currentJobCount: { $gt: 0 }
          }
        },
        {
          $lookup: {
            from: 'departments',
            localField: '_id.department',
            foreignField: '_id',
            as: 'departmentDetails'
          }
        },
        {
          $unwind: {
            path: '$departmentDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 0,
            department: '$departmentDetails.name',
            currentJobCount: 1
          }
        }
      ]),
      this.reportModel.aggregate([
        {
          $group: {
            _id: {
              branch: '$branch'
            },
            currentJobCount: {
              $sum: { $ifNull: ['$currentJobCount', 0] }
            }
          }
        },
        {
          $match: {
            currentJobCount: { $gt: 0 }
          }
        },
        {
          $lookup: {
            from: 'branches',
            localField: '_id.branch',
            foreignField: '_id',
            as: 'branchDetails'
          }
        },
        {
          $unwind: {
            path: '$branchDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 0,
            branch: '$branchDetails.name',
            currentJobCount: 1
          }
        }
      ])
    ]);

    return {
      departmentsCount,
      servicesCount,
      branchesCount,
      subdivisionsCount,
      servicesInDepartmentsCount,
      subdivisionsInBranchesCount,
      departmentChart,
      branchChart,
      departmentReportChart,
      branchReportChart
    };
  }

  async database() {
    const [
      departmentsCount,
      servicesCount,
      branchesCount,
      subdivisionsCount,
      servicesInDepartmentsCount,
      subdivisionsInBranchesCount,
      departmentChart,
      branchChart
    ] = await Promise.all([
      this.departmentModel.countDocuments(),
      this.serviceModel.countDocuments(),
      this.branchModel.countDocuments(),
      this.subdivisionModel.countDocuments(),
      this.departmentModel
        .aggregate([{ $unwind: '$services' }, { $count: 'count' }])
        .then(([{ count } = { count: 0 }]) => count),
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
      servicesInDepartmentsCount,
      subdivisionsInBranchesCount,
      departmentChart,
      branchChart
    };
  }

  async datacore() {
    const currentDate = new Date();

    const firstDayOfPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    const { startOfWeek, endOfWeek } = this.getStartAndEndDateOfWeek(currentDate);

    const [
      profilesCount,
      departmentsCount,
      servicesCount,
      branchesCount,
      subdivisionsCount,
      activityAPIChrat,
      activityProfilesChart
    ] = await Promise.all([
      this.profileModel.countDocuments(),
      this.departmentModel.countDocuments(),
      this.serviceModel.countDocuments(),
      this.branchModel.countDocuments(),
      this.branchModel
        .aggregate([{ $unwind: '$subdivisions' }, { $count: 'count' }])
        .then(([{ count } = { count: 0 }]) => count),
      this.syslogModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: firstDayOfPreviousMonth,
              $lt: currentDate
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day'
              }
            },
            count: 1
          }
        },
        {
          $sort: {
            date: 1
          }
        }
      ]),
      this.syslogModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfWeek,
              $lte: endOfWeek
            },
            profile: {
              $nin: ['anonymous', 'system']
            }
          }
        },
        {
          $group: {
            _id: {
              profile: '$profile',
              method: '$method'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.profile',
            methods: {
              $push: {
                method: '$_id.method',
                count: '$count'
              }
            }
          }
        },
        {
          $project: {
            profile: '$_id',
            methods: 1,
            _id: 0
          }
        }
      ])
    ]);

    return {
      profilesCount,
      departmentsCount,
      servicesCount,
      branchesCount,
      subdivisionsCount,
      activityAPIChrat,
      activityProfilesChart
    };
  }
}
