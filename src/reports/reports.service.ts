import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, PaginateModel, Types } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { Report } from 'src/reports/schemas/report.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Subdivision } from 'src/subdivisions/schemas/subdivision.schema';

import { UpdateReportCountDto } from './dto/update-report-count.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: PaginateModel<Report>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Subdivision.name) private readonly subdivisionModel: Model<Subdivision>
  ) {}

  async createAllByDepartmentId(departmentId: string): Promise<Boolean> {
    try {
      if (!Types.ObjectId.isValid(departmentId)) {
        throw new BadRequestException('Недійсний ідентифікатор відділу');
      }

      const department = await this.departmentModel
        .findById(departmentId)
        .populate('services', { code: 1, name: 1, price: 1 })
        .exec();

      if (!department) {
        throw new NotFoundException('Запис відділу не знайдено');
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
              department: department.id,
              service: service.id,
              branch: branch.id,
              subdivision: subdivision.id,
              previousJobCount: 0,
              changesJobCount: 0,
              currentJobCount: 0,
              completed: false
            });
          }
        }
      }

      const currentReports = await this.reportModel
        .find({ department: department.id }, null, { autopopulate: false })
        .exec();

      if (currentReports.length) {
        createdReports.forEach(createdReport => {
          const currentReport = currentReports.find(
            ({ department, service, branch, subdivision }) =>
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

        await this.reportModel.deleteMany({ department: department.id });

        await this.reportModel.insertMany(createdReports);
      } else {
        const previousReports = await this.reportModel
          .find({ department: department.id }, null, { autopopulate: false })
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

  async findAllByDepartmentId(department: string): Promise<Report[]> {
    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор відділу');
    }

    return await this.reportModel
      .find({ department })
      .populate('department', { name: 1, description: 1, phone: 1, manager: 1 })
      .populate('service', { code: 1, name: 1, price: 1 })
      .populate('branch', { name: 1, description: 1 })
      .populate('subdivision', { name: 1, description: 1 })
      .exec();
  }

  async updateOneByReportId(
    id: string,
    updateReportCountDto: UpdateReportCountDto
  ): Promise<Report> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    try {
      const report = await this.reportModel
        .findById(id)
        .select({ previousJobCount: 1, changesJobCount: 1, currentJobCount: 1, completed: 1 });

      if (!report) {
        throw new NotFoundException('Запис не знайдено');
      }

      if (report?.completed === true) {
        throw new NotFoundException('Запис закрито для редагування');
      }

      const updatedReport = await this.reportModel
        .findByIdAndUpdate(
          id,
          {
            $set: {
              previousJobCount: report.previousJobCount,
              changesJobCount: updateReportCountDto.changesJobCount,
              currentJobCount: report.previousJobCount + updateReportCountDto.changesJobCount
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

  async updateAllByDepartmentId(
    department: string,
    updateReportStatusDto: UpdateReportStatusDto
  ): Promise<Record<string, any>> {
    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    try {
      const { completed = false } = updateReportStatusDto;

      const updatedReport = await this.reportModel
        .updateMany(
          { department: new Types.ObjectId(department) },
          { $set: { completed: completed } },
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

  async removeAllByDepartmentId(department: string): Promise<DeleteResult> {
    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deleteResult = await this.reportModel
      .deleteMany({ department: new Types.ObjectId(department) })
      .exec();

    if (!deleteResult) {
      throw new NotFoundException('Запис не знайдено');
    }

    return deleteResult;
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
