import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags
} from '@nestjs/swagger';
import { PaginateResult } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/administrator.guard';
import { AdminRequired } from 'src/common/decorators/admin.decorator';

import { ProfilesService } from './profiles.service';
import { PaginateProfile, Profile } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Профілі')
@Controller('profiles')
@ApiBearerAuth('JWT Guard')
@AdminRequired()
@UseGuards(AccessTokenGuard, AdminGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Потрібені права адміністратора'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Profile })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateProfileDto })
  async create(@Body() createUserDto: CreateProfileDto): Promise<Profile> {
    return await this.profilesService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateProfile })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Profile>> {
    return await this.profilesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: Profile })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Profile> {
    return await this.profilesService.findOneById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: Profile })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateProfileDto })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<Profile> {
    return await this.profilesService.updateOneById(id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: Profile })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Profile> {
    return await this.profilesService.removeOneById(id);
  }
}
