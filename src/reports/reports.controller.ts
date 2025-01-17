import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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
import { DeleteResult } from 'mongoose';

import { Roles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { UpdateReportCountDto } from './dto/update-report-count.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
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
  @ApiParam({ name: 'department', description: 'ID Ідентифікатор відділу', type: String })
  async createAllByDepartmentId(@Param('department') department: string): Promise<Boolean> {
    return await this.reportsService.createAllByDepartmentId(department);
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
  @ApiParam({ name: 'department', description: 'ID Ідентифікатор відділу', type: String })
  async findAllByDepartmentId(@Param('department') department: string): Promise<Report[]> {
    return await this.reportsService.findAllByDepartmentId(department);
  }

  @Put(':report')
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
  @ApiParam({ name: 'report', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateReportCountDto })
  async updateOneByReportId(
    @Param('report') id: string,
    @Body() updateReportCountDto: UpdateReportCountDto
  ): Promise<Report> {
    return await this.reportsService.updateOneByReportId(id, updateReportCountDto);
  }

  @Put('completed/:department')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Object })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'department', description: 'ID Ідентифікатор відділу', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateReportStatusDto })
  async updateOneStatusById(
    @Param('department') department: string,
    @Body() updateReportStatusDto: UpdateReportStatusDto
  ): Promise<Record<string, any>> {
    return await this.reportsService.updateAllByDepartmentId(department, updateReportStatusDto);
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
  async removeAllByDepartmentId(@Param('department') department: string): Promise<DeleteResult> {
    return await this.reportsService.removeAllByDepartmentId(department);
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
