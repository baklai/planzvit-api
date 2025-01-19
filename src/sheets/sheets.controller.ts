import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { Roles } from 'src/common/decorators/roles.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { Sheet } from './schemas/sheet.schema';
import { SheetsService } from './sheets.service';

@ApiTags('Комплексні звіти')
@Controller('sheets')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get('reports')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: [Object] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getReportByIds(): Promise<Record<string, any>[]> {
    return await this.sheetsService.getReportByIds();
  }

  @Get('reports/:id')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: [Object] })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getReportById(@Param('id') id: string): Promise<Record<string, any>[]> {
    return await this.sheetsService.getReportById(id);
  }

  @Get('branches')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Sheet })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getBranchByIds(): Promise<Sheet> {
    return await this.sheetsService.getBranchByIds();
  }

  @Get('branches/:id')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Sheet })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getBranchById(@Param('id') id: string): Promise<Sheet> {
    return await this.sheetsService.getBranchById(id);
  }

  @Get('subdivisions')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Sheet })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getSubdivisionByIds(): Promise<Sheet> {
    return await this.sheetsService.getSubdivisionByIds();
  }

  @Get('subdivisions/:id')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: `Необхідні ролі: [${[ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',')}]`
  })
  @ApiOkResponse({ description: 'Успіх', type: Sheet })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getSubdivisionById(@Param('id') id: string): Promise<Sheet> {
    return await this.sheetsService.getSubdivisionById(id);
  }
}
