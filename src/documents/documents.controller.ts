import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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

import { DocumentsService } from './documents.service';
import { SubdivisionDocumentDto } from './dto/subdivision-document.dto';
import { Document } from './schemas/document.schema';
import { BranchDocumentDto } from './dto/branch-document.dto';

@ApiTags('Комплексні звіти')
@Controller('documents')
@ApiBearerAuth('JWT Guard')
@UseGuards(AccessTokenGuard, AdminRoleGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('subdivision')
  @Roles(['moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні ролі: [' + ['moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Document })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getSubdivisionDocument(@Query() query: SubdivisionDocumentDto): Promise<Document> {
    return await this.documentsService.getSubdivisionDocument(query);
  }

  @Get('branch')
  @Roles(['moderator', 'administrator'])
  @ApiOperation({
    summary: 'Отримати всі записи',
    description: 'Необхідні ролі: [' + ['moderator', 'administrator'].join(',') + ']'
  })
  @ApiOkResponse({ description: 'Успіх', type: Document })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  async getBranchDocument(@Query() query: BranchDocumentDto): Promise<Document> {
    return await this.documentsService.getBranchDocument(query);
  }
}
