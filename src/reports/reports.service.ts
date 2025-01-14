import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { Report } from 'src/reports/schemas/report.schema';
import { Service } from 'src/services/schemas/service.schema';

import { CreateReportDto } from './dto/create-report.dto';
import { QueryReportDto } from './dto/query-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: PaginateModel<Report>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Boolean> {
    try {
      const { department, monthOfReport, yearOfReport } = createReportDto;

      if (!Types.ObjectId.isValid(department)) {
        throw new BadRequestException('Недійсний ідентифікатор запису');
      }
      const aDepartment = await this.departmentModel
        .findById(department)
        .populate('services')
        .exec();

      if (!aDepartment) {
        throw new NotFoundException('Запис не знайдено');
      }

      const currReports = await this.reportModel
        .find(
          {
            department: aDepartment.id,
            monthOfReport: monthOfReport,
            yearOfReport: yearOfReport
          },
          null,
          { autopopulate: false }
        )
        .exec();

      if (currReports?.length > 0) return false;

      const branches = await this.branchModel.find({}).exec();

      const prevReports = await this.reportModel
        .find(
          {
            department: aDepartment.id,
            monthOfReport: monthOfReport - 1,
            yearOfReport: yearOfReport
          },
          null,
          { autopopulate: false }
        )
        .exec();

      const reports = [];

      for (const service of aDepartment.services) {
        for (const branch of branches) {
          for (const subdivision of branch.subdivisions) {
            reports.push({
              monthOfReport,
              yearOfReport,
              department: aDepartment.id,
              service: service.id,
              branch: branch.id,
              subdivision: subdivision.id,
              previousJobCount: 0,
              changesJobCount: 0,
              currentJobCount: 0
            });
          }
        }
      }

      if (prevReports.length) {
        reports.forEach(curReport => {
          const report = prevReports.find(
            prevReport =>
              prevReport?.department.toString() === curReport?.department &&
              prevReport?.service.toString() === curReport?.service &&
              prevReport?.branch.toString() === curReport?.branch &&
              prevReport?.subdivision.toString() === curReport?.subdivision.toString()
          );

          if (report) {
            curReport.previousJobCount = report?.currentJobCount || 0;
            curReport.currentJobCount = report?.currentJobCount || 0;
          }
        });
      }

      await this.reportModel.insertMany(reports);

      return true;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async findAll(queryReportDto: QueryReportDto): Promise<Record<string, any>[]> {
    const { monthOfReport, yearOfReport, department } = queryReportDto;

    return await this.reportModel.aggregate([
      {
        $match: {
          department: new Types.ObjectId(department),
          monthOfReport: monthOfReport,
          yearOfReport: yearOfReport
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
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
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceDetails'
        }
      },
      {
        $unwind: {
          path: '$serviceDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branch',
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
        $unwind: {
          path: '$subdivisionDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          id: { $toString: '$_id' },
          _id: 0,
          monthOfReport: 1,
          yearOfReport: 1,
          previousJobCount: 1,
          changesJobCount: 1,
          currentJobCount: 1,
          createdAt: 1,
          updatedAt: 1,
          department: {
            name: '$departmentDetails.name',
            description: '$departmentDetails.description',
            phone: '$departmentDetails.phone',
            manager: '$departmentDetails.manager',
            id: { $toString: '$departmentDetails._id' }
          },
          service: {
            code: '$serviceDetails.code',
            name: '$serviceDetails.name',
            price: '$serviceDetails.price',
            id: { $toString: '$serviceDetails._id' }
          },
          branch: {
            name: '$branchDetails.name',
            description: '$branchDetails.description',
            id: { $toString: '$branchDetails._id' }
          },
          subdivision: {
            $arrayElemAt: [
              {
                $map: {
                  input: {
                    $filter: {
                      input: '$branchDetails.subdivisions',
                      as: 'subdivision',
                      cond: { $eq: ['$$subdivision._id', '$subdivision'] }
                    }
                  },
                  as: 'subdivision',
                  in: {
                    id: { $toString: '$$subdivision._id' },
                    name: '$$subdivision.name',
                    description: '$$subdivision.description'
                  }
                }
              },
              0
            ]
          }
        }
      }
    ]);
  }

  async findOneById(id: string): Promise<Report> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const report = await this.reportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException('Запис не знайдено');
    }
    return report;
  }

  async updateOneById(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    try {
      const updatedReport = await this.reportModel
        .findByIdAndUpdate(id, { $set: updateReportDto }, { new: true })
        .exec();
      if (!updatedReport) {
        throw new NotFoundException('Запис не знайдено');
      }
      return updatedReport;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async removeOneById(id: string): Promise<Report> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deletedReport = await this.reportModel.findByIdAndDelete(id).exec();

    if (!deletedReport) {
      throw new NotFoundException('Запис не знайдено');
    }

    return deletedReport;
  }

  async findCollecrions(): Promise<any> {
    const [deparments, services, branches, subdivisions] = await Promise.all([
      this.departmentModel.find({}, { name: 1, description: 1, manager: 1 }),
      this.serviceModel.find({}, { code: 1, name: 1 }),
      this.branchModel.find({}, { name: 1, description: 1 }),
      this.branchModel.aggregate([
        { $unwind: '$subdivisions' },
        { $replaceRoot: { newRoot: '$subdivisions' } },
        { $project: { _id: 0, id: '$_id', name: 1, description: 1 } }
      ])
    ]);

    return { deparments, services, branches, subdivisions };
  }
}
