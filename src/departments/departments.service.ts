import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

import { Department } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: PaginateModel<Department>
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    try {
      return await this.departmentModel.create(createDepartmentDto);
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async findAll(query: PaginateQueryDto): Promise<PaginateResult<Department>> {
    const { offset = 0, limit = 5, sort = { code: 1 }, filters = {} } = query;

    return await this.departmentModel.paginate(
      { ...filters },
      {
        sort,
        offset,
        limit,
        populate: ['services'],
        lean: false,
        allowDiskUse: true
      }
    );
  }

  async findOneById(id: string): Promise<Department> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException('Запис не знайдено');
    }
    return department;
  }

  async updateOneById(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    try {
      const updatedDepartment = await this.departmentModel
        .findByIdAndUpdate(id, { $set: updateDepartmentDto }, { new: true })
        .exec();
      if (!updatedDepartment) {
        throw new NotFoundException('Запис не знайдено');
      }
      return updatedDepartment;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async removeOneById(id: string): Promise<Department> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deletedDepartment = await this.departmentModel.findByIdAndDelete(id).exec();

    if (!deletedDepartment) {
      throw new NotFoundException('Запис не знайдено');
    }

    return deletedDepartment;
  }
}
