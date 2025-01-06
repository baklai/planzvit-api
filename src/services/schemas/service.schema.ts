import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';

@Schema()
export class Service {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({
    description: 'Номер сервісу (повинні бути унікальними)',
    example: '1234.2'
  })
  @IsString()
  @Prop({ type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true })
  readonly number: string;

  @ApiProperty({
    description: 'Назва сервісу (повинні бути унікальними)',
    example: 'Система техпідтримки'
  })
  @IsString()
  @Prop({ type: String, required: true, unique: true, uniqueCaseInsensitive: true, trim: true })
  readonly name: string;

  @ApiProperty({ description: 'Вартість сервісу', example: 120 })
  @IsNumber()
  @Prop({
    type: Number,
    required: true
  })
  readonly price: number;

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

export class PaginateService extends PaginateResponseDto {
  @ApiProperty({ type: [Service], description: 'Масив документів' })
  docs: Service[];
}

export type ServiceDocument = HydratedDocument<Service>;

export const ServiceSchema = SchemaFactory.createForClass(Service);
