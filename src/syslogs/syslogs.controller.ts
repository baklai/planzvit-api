import { Controller, Get, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';

import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { PaginateSyslog, Syslog } from './schemas/syslog.schema';
import { SyslogsService } from './syslogs.service';

@ApiTags('Логи системи')
@Controller('syslogs')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class SyslogsController {
  constructor(private readonly syslogService: SyslogsService) {}

  @Get()
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні ролі: [' + [ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: PaginateSyslog })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async findAll(@Query() query: PaginateQueryDto): Promise<PaginateResult<Syslog>> {
    return await this.syslogService.findAll(query);
  }

  @Delete()
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Видалити всі записи',
    description: 'Необхідні ролі: [' + [ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: String })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async removeAll(): Promise<string> {
    return await this.syslogService.removeAll();
  }

  @Get(':id')
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: 'Необхідні ролі: [' + [ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Syslog })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async findOneById(@Param('id') id: string): Promise<Syslog> {
    return await this.syslogService.findOneById(id);
  }

  @Delete(':id')
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Видалити запис за ID',
    description: 'Необхідні ролі: [' + [ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Syslog })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  @ApiParam({ name: 'id', description: 'ID Ідентифікатор запису', type: String })
  async removeOneById(@Param('id') id: string): Promise<Syslog> {
    return await this.syslogService.removeOneById(id);
  }
}
