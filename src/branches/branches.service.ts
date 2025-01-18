import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult, Types } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { Report } from 'src/reports/schemas/report.schema';

import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './schemas/branch.schema';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name) private readonly branchModel: PaginateModel<Branch>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    try {
      return await this.branchModel.create(createBranchDto);
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async findAll(query: PaginateQueryDto): Promise<PaginateResult<Branch>> {
    const { offset = 0, limit = 5, sort = { code: 1 }, filters = {} } = query;

    return await this.branchModel.paginate(
      { ...filters },
      {
        sort,
        offset,
        limit,
        lean: false,
        allowDiskUse: true,
        populate: ['subdivisions']
      }
    );
  }

  async findOneById(id: string): Promise<Branch> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const branch = await this.branchModel.findById(id).exec();
    if (!branch) {
      throw new NotFoundException('Запис не знайдено');
    }
    return branch;
  }

  async updateOneById(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    try {
      const prevDoc = await this.branchModel.findById(id).exec();

      if (!prevDoc) {
        throw new NotFoundException('Запис не знайдено');
      }

      const updatedBranch = await this.branchModel
        .findByIdAndUpdate(id, { $set: updateBranchDto }, { new: true })
        .exec();

      if (!updatedBranch) {
        throw new NotFoundException('Запис не знайдено');
      }

      const prevSubdivisions = prevDoc.subdivisions || [];
      const updatedSubdivisions = updatedBranch.subdivisions || [];

      const addedSubdivisions = updatedSubdivisions.filter(
        subdivision =>
          Types.ObjectId.isValid(subdivision) && !prevSubdivisions.includes(subdivision)
      );
      const removedSubdivisions = prevSubdivisions.filter(
        subdivision =>
          Types.ObjectId.isValid(subdivision) && !updatedSubdivisions.includes(subdivision)
      );

      if (addedSubdivisions.length) {
        /////////
      }

      if (removedSubdivisions.length) {
        console.log('removedSubdivisions', removedSubdivisions);
        await this.reportModel
          .deleteMany({ branch: updatedBranch.id, subdivision: { $in: removedSubdivisions } })
          .exec();
      }

      return updatedBranch;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async removeOneById(id: string): Promise<Branch> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deletedBranch = await this.branchModel.findByIdAndDelete(id).exec();

    if (!deletedBranch) {
      throw new NotFoundException('Запис не знайдено');
    }

    await this.reportModel.deleteMany({ branch: deletedBranch.id }).exec();

    return deletedBranch;
  }
}
