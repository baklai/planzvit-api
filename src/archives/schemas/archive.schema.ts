import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

import { Branch } from 'src/branches/schemas/branch.schema';
import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';
import { Department } from 'src/departments/schemas/department.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Subdivision } from 'src/subdivisions/schemas/subdivision.schema';

@Schema()
export class Archive {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({ description: 'Дата створення', example: new Date() })
  @IsDate()
  @Prop({ type: Date, default: new Date() })
  readonly completedAt: Date;

  @ApiProperty({ description: 'Ідентифікатор відділу', example: '6299b5cebf44864bfcea37a5' })
  @Prop({ type: Object, default: null })
  readonly department: Department;

  @ApiProperty({ description: 'Ідентифікатор сервісу', example: '6299b5cebf44864bfcea37a5' })
  @Prop({ type: Object, default: null })
  readonly service: Service;

  @ApiProperty({ description: 'Ідентифікатор служби/філії', example: '6299b5cebf44864bfcea37a5' })
  @Prop({ type: Object, default: null })
  readonly branch: Branch;

  @ApiProperty({ description: 'Ідентифікатор підрозділу', example: '6299b5cebf44864bfcea37a5' })
  @Prop({ type: Object, default: null })
  readonly subdivision: Subdivision;

  @ApiProperty({ description: 'Кількість робіт за попередній місяць', example: 50 })
  @IsNumber()
  @Prop({ type: Number, default: 0 })
  readonly previousJobCount: number;

  @ApiProperty({ description: 'Кількість нових робіт за поточний місяць', example: -5 })
  @IsNumber()
  @Prop({ type: Number, default: 0 })
  readonly changesJobCount: number;

  @ApiProperty({ description: 'Кількість робіт всього на поточний місяць', example: 45 })
  @IsNumber()
  @Prop({ type: Number, default: 0 })
  readonly currentJobCount: number;

  @ApiPropertyOptional({ description: 'Дата створення запису', example: new Date() })
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @ApiPropertyOptional({ description: 'Дата оновлення запису', example: new Date() })
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export class PaginateArchive extends PaginateResponseDto {
  @ApiProperty({ type: [Archive], description: 'Масив документів' })
  docs: Archive[];
}

export type ArchiveDocument = HydratedDocument<Archive>;

export const ArchiveSchema = SchemaFactory.createForClass(Archive);
