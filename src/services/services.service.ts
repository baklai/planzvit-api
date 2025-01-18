import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult, Types } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { Department } from 'src/departments/schemas/department.schema';
import { Report } from 'src/reports/schemas/report.schema';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './schemas/service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: PaginateModel<Service>,
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Report.name) private readonly reportModel: Model<Report>
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    try {
      return await this.serviceModel.create(createServiceDto);
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async findAll(query: PaginateQueryDto): Promise<PaginateResult<Service>> {
    const { offset = 0, limit = 5, sort = { code: 1 }, filters = {} } = query;

    return await this.serviceModel.paginate(
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

  async findOneById(id: string): Promise<Service> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException('Запис не знайдено');
    }
    return service;
  }

  async updateOneById(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    try {
      const updatedService = await this.serviceModel
        .findByIdAndUpdate(id, { $set: updateServiceDto }, { new: true })
        .exec();
      if (!updatedService) {
        throw new NotFoundException('Запис не знайдено');
      }
      return updatedService;
    } catch (error) {
      if (error.code === 11000 && error?.keyPattern && error?.keyPattern.name) {
        throw new ConflictException('Запис із такою назвою вже існує');
      }
      throw error;
    }
  }

  async removeOneById(id: string): Promise<Service> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deletedService = await this.serviceModel.findByIdAndDelete(id).exec();

    if (!deletedService) {
      throw new NotFoundException('Запис не знайдено');
    }

    await this.departmentModel
      .updateMany({ services: deletedService.id }, { $pull: { services: deletedService.id } })
      .exec();

    await this.reportModel.deleteMany({ service: deletedService.id }).exec();

    return deletedService;
  }
}
