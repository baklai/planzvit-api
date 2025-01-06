import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class PaginateResponseDto {
  @ApiPropertyOptional({
    description: 'Загальна кількість документів у колекції, які відповідають запиту',
    example: 100
  })
  @IsNumber()
  @IsOptional()
  totalDocs: number;

  @ApiPropertyOptional({ description: 'Використаний ліміт', example: 1 })
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({
    description: 'Лише якщо використовувалися вказані або типові значення сторінки/зміщення',
    example: 10
  })
  @IsNumber()
  @IsOptional()
  offset: number;

  @ApiPropertyOptional({ description: 'Наявність попередньої сторінки', example: true })
  @IsBoolean()
  @IsOptional()
  hasPrevPage: boolean;

  @ApiPropertyOptional({ description: 'Наявність наступної сторінки', example: true })
  @IsBoolean()
  @IsOptional()
  hasNextPage: boolean;

  @ApiPropertyOptional({ description: 'Номер поточної сторінки', example: 11 })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiPropertyOptional({ description: 'Загальна кількість сторінок', example: 100 })
  @IsNumber()
  @IsOptional()
  totalPages: number;

  @ApiPropertyOptional({
    description: 'Номер попередньої сторінки, якщо доступний, або NULL',
    example: 10
  })
  @IsNumber()
  @IsOptional()
  prevPage: number;

  @ApiPropertyOptional({
    description: 'Номер наступної сторінки, якщо доступний, або NULL',
    example: 12
  })
  @IsNumber()
  @IsOptional()
  nextPage: number;

  @ApiPropertyOptional({
    description:
      'Початковий індекс/серійний/хронологічний номер першого документа на поточній сторінці',
    example: 11
  })
  @IsNumber()
  @IsOptional()
  pagingCounter: number;
}
