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
import { BranchesService } from './branches.service';
import { Branch } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginateResult } from 'mongoose';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

@ApiTags('Служби (філії)')
@Controller('branches')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Створити новий запис',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiCreatedResponse({ description: 'Успіх', type: Branch })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiConflictResponse({ description: 'Конфлікт даних' })
  @ApiBody({ description: "Об'єкт тіла запиту", type: CreateBranchDto })
  async create(@Body() createBranchDto: CreateBranchDto): Promise<Branch> {
    return await this.branchesService.create(createBranchDto);
  }

  @Get()
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: [Branch] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Branch>> {
    return await this.branchesService.findAll(query);
  }

  @Get(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Branch })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Branch> {
    return await this.branchesService.findOneById(id);
  }

  @Put(':id')
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Оновити запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
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
  @Roles(['user', 'admin', 'moderator'])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні дозволи: [' + ['user', 'admin', 'moderator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Branch })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Branch> {
    return await this.branchesService.removeOneById(id);
  }
}