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
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report, PaginateReport } from './schemas/report.schema';
import { query } from 'express';
import { QueryReportDto } from './dto/query-report.dto';

@ApiTags('Щомісячні звіти')
@Controller('reports')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Створити новий запис',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Boolean })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: Object })
  async create(@Body() createReportDto: CreateReportDto): Promise<Boolean> {
    return await this.reportsService.create(createReportDto);
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
  @ApiOkResponse({ description: 'Успіх', type: PaginateReport })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() queryReportDto: QueryReportDto): Promise<Report[]> {
    return await this.reportsService.findAll(queryReportDto);
  }

  @Get(':id')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Report })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Report> {
    return await this.reportsService.findOneById(id);
  }

  @Put(':id')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
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
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Report })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Report> {
    return await this.reportsService.removeOneById(id);
  }

  @Get('collecrions/department/service/branch/subdivision')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі суміжні записи',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх' })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findCollecrions(): Promise<any> {
    return await this.reportsService.findCollecrions();
  }
}
