import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
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
import { Service } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('Відділи')
@Controller('departments')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Service })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateServiceDto })
  async create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return await this.servicesService.create(createServiceDto);
  }

  @Get()
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: [Service] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(): Promise<Service[]> {
    return await this.servicesService.findAll();
  }

  @Get(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Service })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Service> {
    return await this.servicesService.findOneById(id);
  }

  @Put(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
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
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Service })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Service> {
    return await this.servicesService.removeOneById(id);
  }
}
