import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, PaginateModel, PaginateResult } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { Channel } from './schemas/channel.schema';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(@InjectModel(Channel.name) private readonly channelModel: PaginateModel<Channel>) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    return await this.channelModel.create(createChannelDto);
  }

  async findAll(query: PaginateQueryDto): Promise<PaginateResult<Channel>> {
    const { offset = 0, limit = 5, sort = { locationFrom: 1 }, filters = {} } = query;
    return await this.channelModel.paginate(
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

  async findOneById(id: string): Promise<Channel> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const channel = await this.channelModel.findById(id).exec();
    if (!channel) {
      throw new NotFoundException('Запис не знайдено');
    }
    return channel;
  }

  async updateOneById(id: string, updateChannelDto: UpdateChannelDto): Promise<Channel> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const updatedChannel = await this.channelModel
      .findByIdAndUpdate(id, { $set: updateChannelDto }, { new: true })
      .exec();
    if (!updatedChannel) {
      throw new NotFoundException('Запис не знайдено');
    }
    return updatedChannel;
  }

  async removeOneById(id: string): Promise<Channel> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор запису');
    }
    const deletedChannel = await this.channelModel.findByIdAndDelete(id).exec();
    if (!deletedChannel) {
      throw new NotFoundException('Запис не знайдено');
    }
    return deletedChannel;
  }
}
