import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { CreateReportDto } from './dto/create-report.dto';
import { QueryReportDto } from './dto/query-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';
import { Report } from './schemas/report.schema';

@ApiTags('Щомісячні звіти')
@Controller('reports')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post(':department')
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Необхідні ролі: [' + [ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Boolean })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: Object })
  async createOneById(
    @Param('department') department: string,
    @Body() createReportDto: CreateReportDto
  ): Promise<Boolean> {
    return await this.reportsService.createOneById(department, createReportDto);
  }

  @Get(':department')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: [Report] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор відділу', type: String })
  async findOneById(
    @Param('department') department: string,
    @Query() queryReportDto: QueryReportDto
  ): Promise<Report[]> {
    return await this.reportsService.findOneById(department, queryReportDto);
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

  @Delete(':department')
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні ролі: [' + [ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Object })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'department', description: 'ID Ідентифікатор відділу', type: String })
  async removeOneById(
    @Param('department') department: string,
    @Query() queryReportDto: QueryReportDto
  ): Promise<Record<string, any>> {
    return await this.reportsService.removeOneById(department, queryReportDto);
  }

  @Get('collections/data')
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
