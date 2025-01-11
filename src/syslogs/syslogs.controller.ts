import { Controller, Get, Param, Delete, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { PaginateResult } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminRequired } from 'src/common/decorators/admin.decorator';
import { AdminRoleGuard } from 'src/common/guards/adminRole.guard';

import { PaginateSyslog, Syslog } from './schemas/syslog.schema';
import { SyslogsService } from './syslogs.service';

@ApiTags('Логи системи')
@Controller('syslogs')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, AdminRoleGuard)
export class SyslogsController {
  constructor(private readonly syslogService: SyslogsService) {}

  @Get()
  @AdminRequired()
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateSyslog })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Syslog>> {
    return await this.syslogService.findAll(query);
  }

  @Delete()
  @AdminRequired()
  @ApiOperation({
    summary: 'Видалити всі записи',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: String })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async removeAll(): Promise<string> {
    return await this.syslogService.removeAll();
  }

  @Get(':id')
  @AdminRequired()
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: Syslog })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Syslog> {
    return await this.syslogService.findOneById(id);
  }

  @Delete(':id')
  @AdminRequired()
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Потрібені права адміністратора'
  })
  @ApiOkResponse({ description: 'Успіх', type: Syslog })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Syslog> {
    return await this.syslogService.removeOneById(id);
  }
}
