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

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './schemas/department.schema';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: PaginateModel<Department>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>
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
    const { offset = 0, limit = 5, sort = { createdAt: 1 }, filters = {} } = query;

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
      const prevDoc = await this.departmentModel.findById(id).exec();

      if (!prevDoc) {
        throw new NotFoundException('Запис не знайдено');
      }

      const updatedDepartment = await this.departmentModel
        .findByIdAndUpdate(id, { $set: updateDepartmentDto }, { new: true })
        .exec();

      if (!updatedDepartment) {
        throw new NotFoundException('Запис не знайдено');
      }

      const prevServices = prevDoc.services || [];
      const updatedServices = updatedDepartment.services || [];

      const addedServices = updatedServices.filter(
        service => Types.ObjectId.isValid(service) && !prevServices.includes(service)
      );
      const removedServices = prevServices.filter(
        service => Types.ObjectId.isValid(service) && !updatedServices.includes(service)
      );

      if (addedServices.length) {
        const branches = await this.branchModel
          .find({})
          .populate('subdivisions', { name: 1, description: 1 })
          .exec();

        const addedReport = [];

        for (const service of addedServices) {
          for (const branch of branches) {
            for (const subdivision of branch.subdivisions) {
              addedReport.push({
                department: updatedDepartment.id,
                service: service,
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

        await this.reportModel.insertMany(addedReport);
      }

      if (removedServices.length) {
        await this.reportModel
          .deleteMany({ department: updatedDepartment.id, service: { $in: removedServices } })
          .exec();
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

    await this.reportModel.deleteMany({ department: deletedDepartment.id }).exec();

    return deletedDepartment;
  }
}
