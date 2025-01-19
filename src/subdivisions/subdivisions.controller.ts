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

import { CreateSubdivisionDto } from './dto/create-subdivision.dto';
import { UpdateSubdivisionDto } from './dto/update-subdivision.dto';
import { PaginateSubdivision, Subdivision } from './schemas/subdivision.schema';
import { SubdivisionsService } from './subdivisions.service';

@ApiTags('Структурні підрозділи')
@Controller('subdivisions')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class SubdivisionsController {
  constructor(private readonly subdivisionsService: SubdivisionsService) {}

  @Post()
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: `Необхідні ролі: [${[ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Subdivision })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateSubdivisionDto })
  async create(@Body() createSubdivisionDto: CreateSubdivisionDto): Promise<Subdivision> {
    return await this.subdivisionsService.create(createSubdivisionDto);
  }

  @Get()
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateSubdivision })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Subdivision>> {
    return await this.subdivisionsService.findAll(query);
  }

  @Get(':id')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Subdivision })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Subdivision> {
    return await this.subdivisionsService.findOneById(id);
  }

  @Put(':id')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Subdivision })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateSubdivisionDto })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateSubdivisionDto: UpdateSubdivisionDto
  ): Promise<Subdivision> {
    return await this.subdivisionsService.updateOneById(id, updateSubdivisionDto);
  }

  @Delete(':id')
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Subdivision })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Subdivision> {
    return await this.subdivisionsService.removeOneById(id);
  }
}
