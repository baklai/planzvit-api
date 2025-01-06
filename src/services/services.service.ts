import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, PaginateModel, PaginateResult, Model } from 'mongoose';

import { Service } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service.name) private readonly serviceModel: PaginateModel<Service>) {}

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
    const { offset = 0, limit = 5, sort = { number: 1 }, filters = {} } = query;

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

    return deletedService;
  }
}
