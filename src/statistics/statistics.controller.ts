import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { StatisticsService } from './statistics.service';

@ApiTags('Статистика')
@Controller('statistics')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  @Roles([ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати статистику',
    description: `Необхідні ролі: [${[ProfileRole.USER, ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @HttpCode(HttpStatus.OK)
  async dashboard() {
    return await this.statisticsService.dashboard();
  }

  @Get('database')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати статистику',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @HttpCode(HttpStatus.OK)
  async database() {
    return await this.statisticsService.database();
  }

  @Get('datacore')
  @Roles([ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати статистику',
    description: `Необхідні ролі: [${[ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @HttpCode(HttpStatus.OK)
  async datacore() {
    return await this.statisticsService.datacore();
  }
}
