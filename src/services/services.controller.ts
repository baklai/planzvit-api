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
import { ServicesService } from './services.service';
import { PaginateService, Service } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginateResult } from 'mongoose';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

@ApiTags('Сервіси')
@Controller('services')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Service })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateServiceDto })
  async create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return await this.servicesService.create(createServiceDto);
  }

  @Get()
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateService })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Service>> {
    return await this.servicesService.findAll(query);
  }

  @Get(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Service })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Service> {
    return await this.servicesService.findOneById(id);
  }

  @Put(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Service })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateServiceDto })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto
  ): Promise<Service> {
    return await this.servicesService.updateOneById(id, updateServiceDto);
  }

  @Delete(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні ролі: [' + ['user', 'moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Service })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Service> {
    return await this.servicesService.removeOneById(id);
  }
}
