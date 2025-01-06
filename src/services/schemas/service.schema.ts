import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

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

  @ApiProperty({ description: 'Вартість сервісу', example: '120' })
  @IsNumber()
  @Prop({
    type: Number,
    required: true,
    trim: true
  })
  readonly price: string;

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

export type ServiceDocument = HydratedDocument<Service>;

export const ServiceSchema = SchemaFactory.createForClass(Service);
