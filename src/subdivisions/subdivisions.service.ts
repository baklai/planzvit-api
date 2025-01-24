import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult, Types } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { Report } from 'src/reports/schemas/report.schema';

import { CreateSubdivisionDto } from './dto/create-subdivision.dto';
import { UpdateSubdivisionDto } from './dto/update-subdivision.dto';
import { Subdivision } from './schemas/subdivision.schema';

@Injectable()
export class SubdivisionsService {
  constructor(
    @InjectModel(Subdivision.name) private readonly subdivisionModel: PaginateModel<Subdivision>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>
  ) {}

  async create(createSubdivisionDto: CreateSubdivisionDto): Promise<Subdivision> {
    try {
      return await this.subdivisionModel.create(createSubdivisionDto);
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async findAll(query: PaginateQueryDto): Promise<PaginateResult<Subdivision>> {
    const { offset = 0, limit = 5, sort = { createdAt: 1 }, filters = {} } = query;

    return await this.subdivisionModel.paginate(
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

  async findOneById(id: string): Promise<Subdivision> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const subdivision = await this.subdivisionModel.findById(id).exec();
    if (!subdivision) {
      throw new NotFoundException('Запис не знайдено');
    }
    return subdivision;
  }

  async updateOneById(
    id: string,
    updateSubdivisionDto: UpdateSubdivisionDto
  ): Promise<Subdivision> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    try {
      const updatedSubdivision = await this.subdivisionModel
        .findByIdAndUpdate(id, { $set: updateSubdivisionDto }, { new: true })
        .exec();
      if (!updatedSubdivision) {
        throw new NotFoundException('Запис не знайдено');
      }
      return updatedSubdivision;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async removeOneById(id: string): Promise<Subdivision> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deletedSubdivision = await this.subdivisionModel.findByIdAndDelete(id).exec();

    if (!deletedSubdivision) {
      throw new NotFoundException('Запис не знайдено');
    }

    await this.branchModel
      .updateMany(
        { subdivisions: deletedSubdivision.id },
        { $pull: { subdivisions: deletedSubdivision.id } }
      )
      .exec();

    await this.reportModel.deleteMany({ subdivision: deletedSubdivision.id }).exec();

    return deletedSubdivision;
  }
}
