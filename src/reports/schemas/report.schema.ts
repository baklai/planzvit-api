import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

import { Branch, Subdivision } from 'src/branches/schemas/branch.schema';
import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';
import { Department } from 'src/departments/schemas/department.schema';
import { Service } from 'src/services/schemas/service.schema';

@Schema()
export class Report {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({ description: 'Місяць створення звіту', example: 12 })
  @IsNumber()
  @Prop({ type: Number, required: true })
  readonly monthOfReport: number;

  @ApiProperty({ description: 'Рік створення звіту', example: 2024 })
  @IsNumber()
  @Prop({ type: Number, required: true })
  readonly yearOfReport: number;

  @ApiProperty({ description: 'Ідентифікатор відділу', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
    autopopulate: true
  })
  readonly department: Department;

  @ApiProperty({ description: 'Ідентифікатор сервісу', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    default: null,
    autopopulate: true
  })
  readonly service: Service;

  @ApiProperty({ description: 'Ідентифікатор служби/філії', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    default: null,
    autopopulate: true
  })
  readonly branch: Branch;

  @ApiProperty({ description: 'Ідентифікатор підрозділу', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null, autopopulate: true })
  readonly subdivision: Subdivision;

  @ApiPropertyOptional({ description: 'Кількість робіт - попередній місяць', example: 50 })
  @IsNumber()
  @IsOptional()
  @Prop({ type: Number, default: 0 })
  readonly jobsPreviousMonth: number;

  @ApiPropertyOptional({ description: 'Кількість нових робіт за поточний місяць', example: -5 })
  @IsNumber()
  @IsOptional()
  @Prop({ type: Number, default: 0 })
  readonly jobsCurrentMonth: number;

  @ApiPropertyOptional({ description: 'Кількість робіт всього на поточний місяць', example: 45 })
  @IsNumber()
  @IsOptional()
  @Prop({ type: Number, default: 0 })
  readonly jobsTotalCurrentMonth: number;

  @ApiPropertyOptional({ description: 'Дата створення запису', example: new Date() })
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @ApiPropertyOptional({ description: 'Дата оновлення запису', example: new Date() })
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export class PaginateReport extends PaginateResponseDto {
  @ApiProperty({ type: [Report], description: 'Масив документів' })
  docs: Report[];
}

export type ReportDocument = HydratedDocument<Report>;

export const ReportSchema = SchemaFactory.createForClass(Report);
