import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional, IsNumber, IsDate, IsArray } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { PaginateResponseDto } from 'src/common/dto/paginate-response.dto';

@Schema()
export class Syslog {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4',
    type: String
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4'
  })
  @IsString()
  @IsMongoId()
  @Prop({ type: String })
  readonly host: string;

  @ApiPropertyOptional({
    description: 'ID профілю',
    example: '6299b5cebf44864bfcea36d4'
  })
  @IsString()
  @IsOptional()
  @Prop({ type: String })
  readonly profile: string;

  @ApiPropertyOptional({
    description: 'Спосіб запиту',
    example: 'POST'
  })
  @IsString()
  @IsOptional()
  @Prop({ type: String, trim: true })
  readonly method: string;

  @ApiPropertyOptional({
    description: 'Базовий url запиту',
    example: '/units?limit=10&offset=50'
  })
  @IsString()
  @IsOptional()
  @Prop({ type: String, trim: true })
  readonly baseUrl: string;

  @ApiPropertyOptional({
    description: 'Параметри запиту',
    example: '{"0":"profiles"}'
  })
  @IsString()
  @IsOptional()
  @Prop({ type: String })
  readonly params: string;

  @ApiPropertyOptional({
    description: 'Параметри запиту',
    example: '{"limit":"10","offset":"50"}'
  })
  @IsString()
  @IsOptional()
  @Prop({ type: String })
  readonly query: string;

  @ApiPropertyOptional({
    description: 'Тіло запиту',
    example: '{"name":"Cisco unit"}'
  })
  @IsString()
  @IsOptional()
  @Prop({ type: String })
  readonly body: string;

  @ApiPropertyOptional({
    description: 'Статус запиту',
    example: 200
  })
  @IsNumber()
  @IsOptional()
  @Prop({ type: Number })
  readonly status: number;

  @ApiPropertyOptional({
    description: 'Агент користувача',
    example: 200
  })
  @IsString()
  @IsOptional()
  @Prop({ type: String })
  readonly userAgent: string;

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

export class PaginateSyslog extends PaginateResponseDto {
  @ApiPropertyOptional({ type: [Syslog], description: 'Масив документів' })
  @IsArray()
  @IsOptional()
  docs: Syslog[];
}

export type SyslogDocument = HydratedDocument<Syslog>;

export const SyslogSchema = SchemaFactory.createForClass(Syslog);
