import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, Types } from 'mongoose';

import { Archive } from './schemas/archive.schema';

@Injectable()
export class ArchivesService {
  constructor(@InjectModel(Archive.name) private readonly archiveModel: Model<Archive>) {}

  async getUniqueDatesByMonthAndYear(): Promise<string[]> {
    const result = await this.archiveModel.aggregate([
      {
        $project: {
          monthYear: { $dateToString: { format: '%Y-%m', date: '$completedAt' } }
        }
      },
      {
        $group: {
          _id: '$monthYear'
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          monthYear: '$_id'
        }
      }
    ]);

    return result.map(item => item.monthYear);
  }

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
      .deleteMany({ department: new Types.ObjectId(department) })
      .exec();

    if (!deleteResult) {
      throw new NotFoundException('Запис не знайдено');
    }

    return deleteResult;
  }
}
