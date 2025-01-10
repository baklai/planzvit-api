import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult, Types } from 'mongoose';

import { Department } from 'src/departments/schemas/department.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Branch } from 'src/branches/schemas/branch.schema';
import { Report } from 'src/reports/schemas/report.schema';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: PaginateModel<Report>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>
  ) {}

  async create(createReportDto: Record<string, any>): Promise<Boolean> {
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
              previousMonthJobCount: 0,
              currentMonthJobChanges: 0,
              currentMonthJobCount: 0
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
            curReport.previousMonthJobCount = report?.currentMonthJobCount || 0;
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

  async findAll(query: PaginateQueryDto): Promise<PaginateResult<Report>> {
    const { offset = 0, limit = 5, sort = {}, filters = {} } = query;

    return await this.reportModel.paginate(
      { ...filters },
      {
        sort,
        offset,
        limit,
        lean: false,
        allowDiskUse: true
      }
    );
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
}
