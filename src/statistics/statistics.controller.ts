import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminRoleGuard } from 'src/common/guards/adminRole.guard';
import { AdminRequired } from 'src/common/decorators/admin.decorator';

import { StatisticsService } from './statistics.service';

@ApiTags('Статистика')
@Controller('statistics')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, AdminRoleGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  @AdminRequired()
  @ApiOperation({
    summary: 'Отримати статистику',
    description: 'Потрібені права адміністратора'
  })
  @HttpCode(HttpStatus.OK)
  async dashboard() {
    return await this.statisticsService.dashboard();
  }

  @Get('database')
  @AdminRequired()
  @ApiOperation({
    summary: 'Отримати статистику',
    description: 'Потрібені права адміністратора'
  })
  @HttpCode(HttpStatus.OK)
  async database() {
    return await this.statisticsService.database();
  }

  @Get('datacore')
  @AdminRequired()
  @ApiOperation({
    summary: 'Отримати статистику',
    description: 'Потрібені права адміністратора'
  })
  @HttpCode(HttpStatus.OK)
  async datacore() {
    return await this.statisticsService.datacore();
  }
}
