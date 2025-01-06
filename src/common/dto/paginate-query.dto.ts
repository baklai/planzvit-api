import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

function convertValuesToNumber(val: Record<string, any>) {
  const obj = { ...val };
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        obj[key] = numericValue;
      }
    }
  }
  return obj;
}

export class PaginateQueryDto {
  @ApiProperty({ description: 'Кількість записів на сторінці', example: 5, type: Number })
  @Min(0)
  @Max(50)
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
