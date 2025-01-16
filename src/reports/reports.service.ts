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

import { Subdivision } from 'src/subdivisions/schemas/subdivision.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { QueryReportDto } from './dto/query-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: PaginateModel<Report>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Subdivision.name) private readonly subdivisionModel: Model<Subdivision>
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

      const subdivisions = await this.subdivisionModel.find({}).exec();

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
          for (const subdivision of subdivisions) {
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

    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    return await this.reportModel
      .find({ department, monthOfReport, yearOfReport })
      .populate('department', { name: 1, description: 1, phone: 1, manager: 1 })
      .populate('service', { code: 1, name: 1, price: 1 })
      .populate('branch', { name: 1, description: 1 })
      .populate('subdivision', { name: 1, description: 1 })
      .exec();
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
      this.subdivisionModel.find({}, { name: 1, description: 1 })
    ]);

    return { deparments, services, branches, subdivisions };
  }
}
