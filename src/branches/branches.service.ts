import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

import { Branch } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(@InjectModel(Branch.name) private readonly branchModel: PaginateModel<Branch>) {}

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
        allowDiskUse: true
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
      const updatedBranch = await this.branchModel
        .findByIdAndUpdate(id, { $set: updateBranchDto }, { new: true })
        .exec();
      if (!updatedBranch) {
        throw new NotFoundException('Запис не знайдено');
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

    return deletedBranch;
  }
}
