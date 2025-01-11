import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
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
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { BranchesService } from './branches.service';
import { Branch, PaginateBranch } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@ApiTags('Служби/філії')
@Controller('branches')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Створити новий запис',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Branch })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateBranchDto })
  async create(@Body() createBranchDto: CreateBranchDto): Promise<Branch> {
    return await this.branchesService.create(createBranchDto);
  }

  @Get()
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateBranch })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Branch>> {
    return await this.branchesService.findAll(query);
  }

  @Get(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Branch })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Branch> {
    return await this.branchesService.findOneById(id);
  }

  @Put(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Branch })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  @ApiBody({ description: "Об'єкт тіла запиту", type: UpdateBranchDto })
  async updateOneById(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto
  ): Promise<Branch> {
    return await this.branchesService.updateOneById(id, updateBranchDto);
  }

  @Delete(':id')
  @Roles(['user', 'moderator', 'administrator'])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description:
      'Необхідні ролі: [' +
      [ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') +
      ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Branch })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Branch> {
    return await this.branchesService.removeOneById(id);
  }
}
