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

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminRoleGuard } from 'src/common/guards/adminRole.guard';

import { NoticesService } from './notices.service';
import { Notice } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';

@ApiTags('Повідомлення')
@Controller('notices')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @UseGuards(AdminRoleGuard)
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Потрібені права адміністратора'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: [Notice] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateNoticeDto })
  async create(@Body() createNoticeDto: CreateNoticeDto): Promise<Notice[]> {
    return await this.noticesService.create(createNoticeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all records by ID', description: 'Необхідні ролі: []' })
  @ApiOkResponse({ description: 'Успіх', type: [Notice] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Request() req: Record<string, any>): Promise<Notice[]> {
    return await this.noticesService.findAll(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні ролі: []'
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
