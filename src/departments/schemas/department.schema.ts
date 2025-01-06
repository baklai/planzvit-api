import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';
import { Service } from 'src/services/schemas/service.schema';

@Schema()
export class Department {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({
    description: 'Скорочена назва відділу (повинні бути унікальними)',
    example: 'ВП'
  })
  @IsString()
  @Prop({ type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true })
  readonly code: string;

  @ApiProperty({
    description: 'Назва відділу (повинні бути унікальними)',
    example: 'Відділ продажів'
  })
  @IsString()
  @Prop({ type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true })
  readonly name: string;

  @ApiProperty({ description: 'Номер телефону', example: '+38(234)567-89-10' })
  @IsString()
  @IsPhoneNumber()
  @Prop({
    type: String,
    required: true,
    trim: true
  })
  readonly phone: string;

  @ApiProperty({
    description: 'Начальник відділу',
    example: 'Прізвище В.В.'
  })
  @IsString()
  @Prop({ type: String, required: true, uniqueCaseInsensitive: true, trim: true })
  readonly manager: string;

  @ApiProperty({
    description: 'Ідентифікатор профілю, пов’язаний зі сповіщенням',
    example: ['6299b5cebf44864bfcea37a5']
  })
  @IsString()
  @IsMongoId()
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Service',
    required: true,
    autopopulate: false
  })
  readonly services: [Service];

  @ApiPropertyOptional({
    description: 'Дата створення запису',
    example: new Date()
  })
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @ApiPropertyOptional({
    description: 'Дата оновлення запису',
    example: new Date()
  })
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export class PaginateDepartment extends PaginateResponseDto {
  @ApiProperty({ type: [Department], description: 'Масив документів' })
  docs: Department[];
}

export type DepartmentDocument = HydratedDocument<Department>;

export const DepartmentSchema = SchemaFactory.createForClass(Department);
