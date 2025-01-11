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
import { AdminRoleGuard } from 'src/common/guards/adminRole.guard';
import { ProfileRole } from 'src/profiles/schemas/profile.schema';

import { DocumentsService } from './documents.service';
import { Document } from './schemas/document.schema';
import { DocumentDto } from './dto/document.dto';

@ApiTags('Комплексні звіти')
@Controller('documents')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, AdminRoleGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('subdivisions/:id')
  @Roles(['moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Document })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getSubdivisionById(
    @Param('id') id: string,
    @Query() documentDto: DocumentDto
  ): Promise<Document> {
    return await this.documentsService.getSubdivisionById(id, documentDto);
  }

  @Get('branches/:id')
  @Roles(['moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description:
      'Необхідні ролі: [' + [ProfileRole.MODERATOR, ProfileRole.ADMINISTRATOR].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Document })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getBranchById(
    @Param('id') id: string,
    @Query() documentDto: DocumentDto
  ): Promise<Document> {
    return await this.documentsService.getBranchById(id, documentDto);
  }
}
