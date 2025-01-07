import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { HydratedDocument } from 'mongoose';

import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';

class Subdivision {
  @ApiProperty({ description: 'Назва підрозділу' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Повна назва підрозділу' })
  @IsString()
  readonly description: string;
}

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
    description: 'Перелік підрозділів',
    type: [Subdivision]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Subdivision)
  @Prop({
    type: [{ name: String, description: String }],
    unique: true
  })
  readonly subdivisions: Subdivision[];

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
  @ApiProperty({ type: [Branch], description: 'Масив документів' })
  docs: Branch[];
}

export type BranchDocument = HydratedDocument<Branch>;

export const BranchSchema = SchemaFactory.createForClass(Branch);
