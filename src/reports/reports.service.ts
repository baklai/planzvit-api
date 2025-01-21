import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';

import { Archive } from 'src/archives/schemas/archive.schema';
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
    @InjectModel(Archive.name) private readonly archiveModel: Model<Archive>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Subdivision.name) private readonly subdivisionModel: Model<Subdivision>
  ) {}

  async updateReportByReportId(
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

  async findFiltersByReport(): Promise<any> {
    const [deparments, services, branches, subdivisions] = await Promise.all([
      this.departmentModel.find({}, { name: 1, description: 1, manager: 1 }),
      this.serviceModel.find({}, { code: 1, name: 1 }),
      this.branchModel.find({}, { name: 1, description: 1 }),
      this.subdivisionModel.find({}, { name: 1, description: 1 })
    ]);

    return { deparments, services, branches, subdivisions };
  }

  async createReportArchive(): Promise<Boolean> {
    try {
      const report = await this.reportModel
        .find({})
        .select({
          id: 1,
          department: 1,
          service: 1,
          branch: 1,
          subdivision: 1,
          previousJobCount: 1,
          changesJobCount: 1,
          currentJobCount: 1,
          createdAt: 1,
          updatedAt: 1
        })
        .populate('department', { id: 1, name: 1, description: 1, phone: 1, manager: 1 })
        .populate('service', { id: 1, code: 1, name: 1, price: 1 })
        .populate('branch', { id: 1, name: 1, description: 1 })
        .populate('subdivision', { id: 1, name: 1, description: 1 })
        .exec();

      const objectReport = report.map(item => item.toObject());

      await this.archiveModel.insertMany(objectReport);

      return true;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async createReportByNextPeriod(): Promise<Boolean> {
    try {
      await this.reportModel.aggregate([
        {
          $addFields: {
            previousJobCount: '$currentJobCount',
            completed: false,
            changesJobCount: 0
          }
        },
        {
          $merge: { into: 'reports', whenMatched: 'merge', whenNotMatched: 'fail' }
        }
      ]);

      return true;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async findReportByDepartmentId(department: string): Promise<Report[]> {
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

  async completedReportByDepartmentId(
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
          { upsert: false }
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
}
