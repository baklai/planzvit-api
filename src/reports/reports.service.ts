import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { Service } from 'src/services/schemas/service.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
    @InjectModel(Service.name) private readonly serviceModel: Model<Service>
  ) {}

  async findOneDepartmentById(id: string): Promise<Department> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const department = this.departmentModel.findById(id).populate('services').exec();

    if (!department) {
      throw new NotFoundException('Запис не знайдено');
    }

    return department;
  }

  async departments() {
    return await this.departmentModel.find();
  }

  async branches() {
    return await this.branchModel.find();
  }
}
