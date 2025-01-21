import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { Roles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { ArchivesService } from './archives.service';
import { Archive } from './schemas/archive.schema';

@ApiTags('Архів звітів')
@Controller('archives')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ArchivesController {
  constructor(private readonly archivesService: ArchivesService) {}

  @Get()
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати запис за ID',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: [String] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiNotFoundResponse({ description: 'Не знайдено' })
  async getUniqueDatesByMonthAndYear(): Promise<string[]> {
    return await this.archivesService.getUniqueDatesByMonthAndYear();
  }

  //  @Get('services')
  //    @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  //    @ApiOperation({
  //      summary: 'Отримати всі записи сервісів',
  //      description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  //    })
  //    @ApiOkResponse({ description: 'Успіх', type: [Object] })
  //    @ApiBadRequestResponse({ description: 'Поганий запит' })
  //    async getAggregatedServices(): Promise<Record<string, any>> {
  //      return await this.archivesService.getAggregatedServices();
  //    }

  @Get('reports')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: [Object] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getReportByIds(): Promise<Record<string, any>[]> {
    return await this.archivesService.getReportByIds();
  }

  //  @Get('reports/:id')
  //  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  //  @ApiOperation({
  //    summary: 'Отримати всі записи',
  //    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  //  })
  //  @ApiOkResponse({ description: 'Успіх', type: [Object] })
  //  @ApiBadRequestResponse({ description: 'Поганий запит' })
  //  async getReportById(@Param('id') id: string): Promise<Record<string, any>[]> {
  //    return await this.archivesService.getReportById(id);
  //  }

  @Get('branches')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Archive })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getBranchByIds(): Promise<Archive> {
    return await this.archivesService.getBranchByIds();
  }

  //  @Get('branches/:id')
  //  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  //  @ApiOperation({
  //    summary: 'Отримати всі записи',
  //    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  //  })
  //  @ApiOkResponse({ description: 'Успіх', type: Archive })
  //  @ApiBadRequestResponse({ description: 'Поганий запит' })
  //  async getBranchById(@Param('id') id: string): Promise<Archive> {
  //    return await this.archivesService.getBranchById(id);
  //  }

  @Get('subdivisions')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Archive })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getSubdivisionByIds(): Promise<Archive> {
    return await this.archivesService.getSubdivisionByIds();
  }

  //  @Get('subdivisions/:id')
  //  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  //  @ApiOperation({
  //    summary: 'Отримати всі записи',
  //    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  //  })
  //  @ApiOkResponse({ description: 'Успіх', type: Archive })
  //  @ApiBadRequestResponse({ description: 'Поганий запит' })
  //  async getSubdivisionById(@Param('id') id: string): Promise<Archive> {
  //    return await this.archivesService.getSubdivisionById(id);
  //  }
}
