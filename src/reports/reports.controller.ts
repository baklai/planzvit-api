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

  @Put(':id')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Report })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateReportCountDto })
  async updateReportByReportId(
    @Param('id') id: string,
    @Body() updateReportCountDto: UpdateReportCountDto
  ): Promise<Report> {
    return await this.reportsService.updateReportByReportId(id, updateReportCountDto);
  }

  @Get('filters')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі суміжні записи',
    description: `Необхідні ролі: [${[ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх' })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findFiltersByReport(): Promise<any> {
    return await this.reportsService.findFiltersByReport();
  }

  @Post('archive')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Boolean })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async createReportArchive(): Promise<Boolean> {
    return await this.reportsService.createReportArchive();
  }

  @Post('department/:id')
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: `Необхідні ролі: [${[ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Boolean })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор відділу', type: String })
  async createReportByDepartmentId(@Param('id') id: string): Promise<Boolean> {
    return await this.reportsService.createReportByDepartmentId(id);
  }

  @Get('department/:id')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: [Report] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор відділу', type: String })
  async findReportByDepartmentId(@Param('id') id: string): Promise<Report[]> {
    return await this.reportsService.findReportByDepartmentId(id);
  }

  @Put('department/:id')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Object })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор відділу', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateReportStatusDto })
  async updateReportByDepartmentId(
    @Param('id') id: string,
    @Body() updateReportStatusDto: UpdateReportStatusDto
  ): Promise<Record<string, any>> {
    return await this.reportsService.updateReportByDepartmentId(id, updateReportStatusDto);
  }

  @Delete('department/:id')
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Object })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор відділу', type: String })
  async removeReportByDepartmentId(@Param('id') id: string): Promise<DeleteResult> {
    return await this.reportsService.removeReportByDepartmentId(id);
  }
}
