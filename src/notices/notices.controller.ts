import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiTags
} from '@nestjs/swagger';

import { ProfileRole } from 'src/profiles/schemas/profile.schema';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { NoticesService } from './notices.service';
import { Notice } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';

@ApiTags('Повідомлення')
@Controller('notices')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Створити новий запис',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: [Notice] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateNoticeDto })
  async create(@Body() createNoticeDto: CreateNoticeDto): Promise<Notice[]> {
    return await this.noticesService.create(createNoticeDto);
  }

  @Get()
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOperation({ summary: 'Get all records by ID', description: 'Необхідні ролі: []' })
  @ApiOkResponse({ description: 'Успіх', type: [Notice] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Request() req: Record<string, any>): Promise<Notice[]> {
    return await this.noticesService.findAll(req.user.id);
  }

  @Delete(':id')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Notice })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(
    @Param('id') id: string,
    @Request() req: Record<string, any>
  ): Promise<Notice> {
    return await this.noticesService.removeOneById(id, req.user.id);
  }
}
