import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';

@Schema()
export class Document {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiPropertyOptional({ description: 'Дата створення запису', example: new Date() })
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @ApiPropertyOptional({ description: 'Дата оновлення запису', example: new Date() })
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export class PaginateDocument extends PaginateResponseDto {
  @ApiProperty({ type: [Document], description: 'Масив документів' })
  docs: Document[];
}

export type DocumentDocument = HydratedDocument<Document>;

export const DocumentSchema = SchemaFactory.createForClass(Document);
