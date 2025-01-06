import { Get, Post, Body, Param, Delete, Put, Query, UseGuards, Controller } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags
} from '@nestjs/swagger';
import { PaginateResult } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ChannelsService } from './channels.service';
import { Channel, PaginateChannel } from './schemas/channel.schema';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@ApiTags('Канали')
@Controller('channels')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard)
export class ChannelsController {
  constructor(private readonly channelService: ChannelsService) {}

  @Post()
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Channel })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateChannelDto })
  async create(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
    return await this.channelService.create(createChannelDto);
  }

  @Get()
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateChannel })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Channel>> {
    return await this.channelService.findAll(query);
  }

  @Get(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Channel })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Channel> {
    return await this.channelService.findOneById(id);
  }

  @Put(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Channel })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateChannelDto })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto
  ): Promise<Channel> {
    return await this.channelService.updateOneById(id, updateChannelDto);
  }

  @Delete(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Channel })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Channel> {
    return await this.channelService.removeOneById(id);
  }
}
