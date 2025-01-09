import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/administrator.guard';

import { ReportsService } from './reports.service';

import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report, PaginateReport } from './schemas/report.schema';

@ApiTags('Щомічячні звіти')
@Controller('reports')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, AdminGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Boolean })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: Object })
  async create(@Body() body: Record<string, any>): Promise<Boolean> {
    return await this.reportsService.create(body);
  }

  @Get()
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateReport })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Report>> {
    return await this.reportsService.findAll(query);
  }

  @Get(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Report })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Report> {
    return await this.reportsService.findOneById(id);
  }

  @Put(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Report })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateReportDto })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto
  ): Promise<Report> {
    return await this.reportsService.updateOneById(id, updateReportDto);
  }

  @Delete(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Report })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Report> {
    return await this.reportsService.removeOneById(id);
  }
}
