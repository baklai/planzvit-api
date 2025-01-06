import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model, Types } from 'mongoose';

import { ProfilesService } from 'src/profiles/profiles.service';
import { Syslog } from 'src/syslogs/schemas/syslog.schema';

import { Notice } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectModel(Notice.name) private readonly noticeModel: Model<Notice>,
    @InjectModel(Syslog.name) private readonly syslogModel: Model<Syslog>,
    private readonly profilesService: ProfilesService
  ) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice[]> {
    const { profiles } = await this.profilesService.findProfilesForNotice(createNoticeDto.profiles);

    return await this.noticeModel.create(
      profiles.map(profile => {
        return { profile, title: createNoticeDto.title, text: createNoticeDto.text };
      })
    );
  }

  async findAll(profile: string): Promise<Notice[]> {
    if (!Types.ObjectId.isValid(profile)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    return await this.noticeModel.find({ profile }).exec();
  }

  async removeOneById(id: string, profile: string): Promise<Notice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }

    const deletedNotice = await this.noticeModel.findOneAndDelete({ _id: id, profile }).exec();

    if (!deletedNotice) {
      throw new NotFoundException('Запис не знайдено');
    }

    return deletedNotice;
  }

  @Cron('0 0 * * *')
  async handleTaskNotice() {
    let error = false;
    const monthOffcet = new Date();
    monthOffcet.setMonth(monthOffcet.getMonth() - 3);

    try {
      await this.noticeModel.deleteMany({ createdAt: { $lt: monthOffcet } }).exec();
    } catch (err) {
      error = true;
    } finally {
      console.info(`127.0.0.1 [system] TASK ${error ? 500 : 200} - CLEAR NOTICES`);

      await this.syslogModel.create({
        host: '127.0.0.1',
        profile: 'system',
        method: 'TASK',
        baseUrl: 'CLEAR NOTICES',
        params: null,
        query: null,
        body: null,
        status: error ? 500 : 200,
        userAgent: null
      });
    }
  }
}
