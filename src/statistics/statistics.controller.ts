import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { AdminGuard } from 'src/common/guards/administrator.guard';
import { AdminRequired } from 'src/common/decorators/admin.decorator';

import { StatisticsService } from './statistics.service';

@ApiTags('Статистика')
@Controller('statistics')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, AdminGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

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
}
