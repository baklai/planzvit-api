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

import { Roles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminRoleGuard } from 'src/common/guards/adminRole.guard';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report, PaginateReport } from './schemas/report.schema';

@ApiTags('Щомісячні звіти')
@Controller('reports')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, AdminRoleGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles(['moderator', 'administrator'])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Необхідні ролі: [' + ['moderator', 'administrator'].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Boolean })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: Object })
  async create(@Body() createReportDto: CreateReportDto): Promise<Boolean> {
    return await this.reportsService.create(createReportDto);
  }

  @Get()
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateReport })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Report>> {
    return await this.reportsService.findAll(query);
  }

  @Get(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Report })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Report> {
    return await this.reportsService.findOneById(id);
  }

  @Put(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
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
  @Roles(['moderator', 'administrator'])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Report })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Report> {
    return await this.reportsService.removeOneById(id);
  }
}
