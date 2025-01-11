import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

import { Syslog } from './schemas/syslog.schema';
import { CreateSyslogDto } from './dto/create-syslog.dto';

@Injectable()
export class SyslogsService {
  constructor(@InjectModel(Syslog.name) private readonly syslogModel: PaginateModel<Syslog>) {}

  async create(syslogDto: CreateSyslogDto): Promise<Syslog> {
    return await this.syslogModel.create(syslogDto);
  }

  async findAll(query: PaginateQueryDto): Promise<PaginateResult<Syslog>> {
    const { offset = 0, limit = 5, sort = { createdAt: -1 }, filters = {} } = query;

    return await this.syslogModel.paginate(
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

  async removeAll(): Promise<string> {
    const deletedSyslog = await this.syslogModel.deleteMany().exec();
    if (!deletedSyslog) {
      throw new NotFoundException('Запис не знайдено');
    }
    return 'Ok';
  }

  async findOneById(id: string): Promise<Syslog> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const syslog = await this.syslogModel.findById(id).exec();
    if (!syslog) {
      throw new NotFoundException('Запис не знайдено');
    }
    return syslog;
  }

  async removeOneById(id: string): Promise<Syslog> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const deletedSyslog = await this.syslogModel.findByIdAndDelete(id).exec();
    if (!deletedSyslog) {
      throw new NotFoundException('Запис не знайдено');
    }
    return deletedSyslog;
  }

  @Cron('0 0 * * *')
  async handleTaskSysLogs() {
    let error = false;
    const monthOffcet = new Date();
    monthOffcet.setMonth(monthOffcet.getMonth() - 3);
    try {
      await this.syslogModel.deleteMany({ createdAt: { $lt: monthOffcet } }).exec();
    } catch (err) {
      error = true;
    } finally {
      console.info(`127.0.0.1 [system] TASK ${error ? 500 : 200} - CLEAR LOGS`);
      await this.syslogModel.create({
        host: '127.0.0.1',
        profile: 'system',
        method: 'TASK',
        baseUrl: 'CLEAR LOGS',
        params: null,
        query: null,
        body: null,
        status: error ? 500 : 200,
        userAgent: null
      });
    }
  }
}
