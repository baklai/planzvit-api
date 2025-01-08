import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/administrator.guard';
import { AdminRequired } from 'src/common/decorators/admin.decorator';

import { ReportsService } from './reports.service';
import { Department } from 'src/departments/schemas/department.schema';

@ApiTags('Щомічячні звіти')
@Controller('reports')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, AdminGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('departments/:id')
  @ApiOperation({
    summary: 'Отримати відділ за ID',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: Department })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneDepartmentById(@Param('id') id: string): Promise<Department> {
    return await this.reportsService.findOneDepartmentById(id);
  }

  @Get('departments')
  @ApiOperation({
    summary: 'Отримати перелік відділів',
    description: 'Потрібені права адміністратора'
  })
  @HttpCode(HttpStatus.OK)
  async departments() {
    return await this.reportsService.departments();
  }

  @Get('branches')
  @AdminRequired()
  @ApiOperation({
    summary: 'Отримати перелік служб (філій)',
    description: 'Потрібені права адміністратора'
  })
  @HttpCode(HttpStatus.OK)
  async branches() {
    return await this.reportsService.branches();
  }
}
