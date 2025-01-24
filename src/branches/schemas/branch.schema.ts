import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';
import { Subdivision } from 'src/subdivisions/schemas/subdivision.schema';

@Schema()
export class Branch {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({
    description: 'Назва служби (філії) (повинні бути унікальними)',
    example: 'ФП'
  })
  @IsString()
  @Prop({ type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true })
  readonly name: string;

  @ApiProperty({
    description: 'Повна назва служби (філії) (повинні бути унікальними)',
    example: 'Філія продажів'
  })
  @IsString()
  @Prop({ type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true })
  readonly description: string;

  @ApiProperty({
    description: 'Ідентифікатор структурного підрозділу',
    example: ['6299b5cebf44864bfcea37a5']
  })
  @IsString()
  @IsMongoId()
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Subdivision',
    default: [],
    autopopulate: false
  })
  readonly subdivisions: [Subdivision];

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

export class PaginateBranch extends PaginateResponseDto {
  @ApiProperty({ type: [Branch], description: 'Масив документів' })
  docs: Branch[];
}

export type BranchDocument = HydratedDocument<Branch>;

export const BranchSchema = SchemaFactory.createForClass(Branch);
