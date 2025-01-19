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
import { PaginateResult } from 'mongoose';

import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department, PaginateDepartment } from './schemas/department.schema';

@ApiTags('Відділи')
@Controller('departments')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Department })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateDepartmentDto })
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return await this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateDepartment })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Department>> {
    return await this.departmentsService.findAll(query);
  }

  @Get(':id')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Department })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Department> {
    return await this.departmentsService.findOneById(id);
  }

  @Put(':id')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
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
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Department })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Department> {
    return await this.departmentsService.removeOneById(id);
  }
}
