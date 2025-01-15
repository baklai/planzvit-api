import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
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

import { SheetDto } from './dto/sheet.dto';
import { Sheet } from './schemas/sheet.schema';
import { SheetsService } from './sheets.service';

@ApiTags('Комплексні звіти')
@Controller('sheets')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, RolesGuard)
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get('branches')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Sheet })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getBranchByIds(@Param('id') id: string, @Query() sheetDto: SheetDto): Promise<Sheet> {
    return await this.sheetsService.getBranchById(id, sheetDto);
  }

  @Get('branches/:id')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Sheet })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getBranchById(@Param('id') id: string, @Query() sheetDto: SheetDto): Promise<Sheet> {
    return await this.sheetsService.getBranchById(id, sheetDto);
  }

  @Get('subdivisions')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Sheet })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getSubdivisionByIds(@Param('id') id: string, @Query() sheetDto: SheetDto): Promise<Sheet> {
    return await this.sheetsService.getSubdivisionById(id, sheetDto);
  }

  @Get('subdivisions/:id')
  @Roles([ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Sheet })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getSubdivisionById(@Param('id') id: string, @Query() sheetDto: SheetDto): Promise<Sheet> {
    return await this.sheetsService.getSubdivisionById(id, sheetDto);
  }
}
