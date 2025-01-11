import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags
} from '@nestjs/swagger';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DepartmentsService } from './departments.service';
import { Department, PaginateDepartment } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PaginateResult } from 'mongoose';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

@ApiTags('Відділи')
@Controller('departments')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Department })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateDepartmentDto })
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return await this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateDepartment })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Department>> {
    return await this.departmentsService.findAll(query);
  }

  @Get(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Department })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Department> {
    return await this.departmentsService.findOneById(id);
  }

  @Put(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Department })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateDepartmentDto })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ): Promise<Department> {
    return await this.departmentsService.updateOneById(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Department })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Department> {
    return await this.departmentsService.removeOneById(id);
  }
}
