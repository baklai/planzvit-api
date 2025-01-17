import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, PaginateModel, Types } from 'mongoose';

import { Report } from 'src/reports/schemas/report.schema';

import { Archive } from './schemas/archive.schema';

@Injectable()
export class ArchivesService {
  constructor(
    @InjectModel(Archive.name) private readonly archiveModel: PaginateModel<Archive>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>
  ) {}

  async create(departmentId: string): Promise<Boolean> {
    try {
      if (!Types.ObjectId.isValid(departmentId)) {
        throw new BadRequestException('Недійсний ідентифікатор відділу');
      }

      return true;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async findOne(department: string): Promise<Archive[]> {
    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор відділу');
    }

    return await this.archiveModel
      .find({ department })
      .populate('department', { name: 1, description: 1, phone: 1, manager: 1 })
      .populate('service', { code: 1, name: 1, price: 1 })
      .populate('branch', { name: 1, description: 1 })
      .populate('subdivision', { name: 1, description: 1 })
      .exec();
  }

  async removeOne(department: string): Promise<DeleteResult> {
    if (!Types.ObjectId.isValid(department)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deleteResult = await this.archiveModel
      .deleteMany({
        department: new Types.ObjectId(department)
      })
      .exec();

    if (!deleteResult) {
      throw new NotFoundException('Запис не знайдено');
    }

    return deleteResult;
  }
}
