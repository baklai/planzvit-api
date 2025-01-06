import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';

@Schema()
export class Channel {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({ description: 'The location from', example: 'Headquarters' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly locationFrom: string;

  @ApiProperty({ description: 'The unit from', example: 'Router TP-Link' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly unitFrom: string;

  @ApiProperty({ description: 'The location to', example: 'Branch Office' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly locationTo: string;

  @ApiProperty({ description: 'The unit to', example: 'Switch' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly unitTo: string;

  @ApiProperty({ description: 'The level of channel', example: 'High' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly level: string;

  @ApiProperty({ description: 'The type of channel', example: 'Fiber Optic' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly type: string;

  @ApiProperty({ description: 'The speed of channel', example: '10 Gbps' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly speed: string;

  @ApiProperty({ description: 'The status of channel', example: 'Active' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly status: string;

  @ApiProperty({ description: 'The operator of channel', example: 'ISP' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly operator: string;

  @ApiProperty({ description: 'The composition of channel', example: 'Single-mode' })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly composition: string;

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

export class PaginateChannel extends PaginateResponseDto {
  @ApiPropertyOptional({ type: [Channel], description: 'Масив документів' })
  @IsArray()
  @IsOptional()
  docs: Channel[];
}

export type ChannelDocument = HydratedDocument<Channel>;

export const ChannelSchema = SchemaFactory.createForClass(Channel);
