import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsObject, IsOptional, Min } from 'class-validator';

export class PaginateQueryDto {
  @ApiProperty({ description: 'Кількість записів на сторінці', example: 5, type: Number })
  @Min(0)
  @IsInt()
  readonly limit: number;

  @ApiProperty({
    description: 'Кількість записів, які потрібно пропустити',
    example: 0,
    type: Number
  })
  @Min(0)
  @IsInt()
  readonly offset: number;

  @ApiPropertyOptional({
    description: 'Рядок сортування (наприклад, sort={"field":"asc"})',
    type: String
  })
  @IsObject()
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : {}))
  readonly sort: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Рядок фільтрації (наприклад, filters={"field":"value"})',
    type: String
  })
  @IsObject()
  @IsOptional()
  @Transform(({ value }) => (value ? JSON.parse(value) : {}))
  readonly filters: Record<string, any>;
}
