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
import { UpdateStatusReportDto } from './dto/update-status-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: PaginateModel<Report>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Subdivision.name) private readonly subdivisionModel: Model<Subdivision>
  ) {}

  async createOneById(departmentId: string, createReportDto: CreateReportDto): Promise<Boolean> {
    try {
      const { monthOfReport, yearOfReport } = createReportDto;

      if (!Types.ObjectId.isValid(departmentId)) {
        throw new BadRequestException('Недійсний ідентифікатор запису');
      }

      const department = await this.departmentModel
        .findById(departmentId)
        .populate('services', { code: 1, name: 1, price: 1 })
        .exec();

      if (!department) {
        throw new NotFoundException('Запис не знайдено');
      }

      const branches = await this.branchModel
        .find({})
        .populate('subdivisions', { name: 1, description: 1 })
        .exec();

      const createdReports = [];

      for (const service of department.services) {
        for (const branch of branches) {
          for (const subdivision of branch.subdivisions) {
            createdReports.push({
              monthOfReport,
              yearOfReport,
              department: department.id,
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

      const currentReports = await this.reportModel
        .find(
          {
            department: department.id,
            monthOfReport: monthOfReport,
            yearOfReport: yearOfReport
          },
          null,
          { autopopulate: false }
        )
        .exec();

      if (currentReports.length) {
        createdReports.forEach(createdReport => {
          const currentReport = currentReports.find(
            ({ monthOfReport, yearOfReport, department, service, branch, subdivision }) =>
              monthOfReport === createdReport.monthOfReport &&
              yearOfReport === createdReport.yearOfReport &&
              department.toString() === createdReport?.department &&
              service.toString() === createdReport?.service &&
              branch.toString() === createdReport?.branch &&
              subdivision.toString() === createdReport?.subdivision
          );

          if (currentReport) {
            createdReport.previousJobCount = currentReport.previousJobCount;
            createdReport.changesJobCount = currentReport.changesJobCount;
            createdReport.currentJobCount = currentReport.currentJobCount;
          }
        });

        await this.reportModel.deleteMany({
          department: department.id,
          monthOfReport: monthOfReport,
          yearOfReport: yearOfReport
        });

        await this.reportModel.insertMany(createdReports);
      } else {
        const previousReports = await this.reportModel
          .find(
            {
              department: department.id,
              monthOfReport: monthOfReport - 1 === 0 ? 12 : monthOfReport - 1,
              yearOfReport: monthOfReport - 1 === 0 ? yearOfReport - 1 : yearOfReport
            },
            null,
            { autopopulate: false }
          )
          .exec();

        if (previousReports.length) {
          createdReports.forEach(createdReport => {
            const previousReport = previousReports.find(
              ({ department, service, branch, subdivision }) =>
                department.toString() === createdReport?.department &&
                service.toString() === createdReport?.service &&
                branch.toString() === createdReport?.branch &&
                subdivision.toString() === createdReport?.subdivision
            );

            if (previousReport) {
              createdReport.previousJobCount = previousReport?.currentJobCount || 0;
              createdReport.currentJobCount = previousReport?.currentJobCount || 0;
            }
          });
        }

        await this.reportModel.insertMany(createdReports);
      }

      return true;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async findOneById(department: string, queryReportDto: QueryReportDto): Promise<Report[]> {
    const { monthOfReport, yearOfReport } = queryReportDto;

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

  async updateOneById(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    try {
      const report = await this.reportModel
        .findById(id)
        .select({ previousJobCount: 1, changesJobCount: 1, currentJobCount: 1 });

      if (!report) {
        throw new NotFoundException('Запис не знайдено');
      }

      if (report?.closed === true) {
        throw new NotFoundException('Запис закрито для редагування');
      }

      const updatedReport = await this.reportModel
        .findByIdAndUpdate(
          id,
          {
            $set: {
              previousJobCount: report.previousJobCount,
              changesJobCount: updateReportDto.changesJobCount,
              currentJobCount: report.previousJobCount + updateReportDto.changesJobCount
            }
          },
          { new: true }
        )
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

  async updateOneStatusById(
    department: string,
    updateStatusReportDto: UpdateStatusReportDto
  ): Promise<Record<string, any>> {
    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    try {
      const { monthOfReport, yearOfReport, closed } = updateStatusReportDto;

      const updatedReport = await this.reportModel
        .updateMany(
          { department: new Types.ObjectId(department), monthOfReport, yearOfReport },
          { $set: { closed: closed } },
          { upsert: true }
        )
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

  async removeOneById(
    department: string,
    queryReportDto: QueryReportDto
  ): Promise<Record<string, any>> {
    const { monthOfReport, yearOfReport } = queryReportDto;

    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deletedReport = await this.reportModel
      .deleteMany({ department: new Types.ObjectId(department), monthOfReport, yearOfReport })
      .exec();

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
