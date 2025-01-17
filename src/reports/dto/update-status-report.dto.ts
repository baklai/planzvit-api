import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateStatusReportDto {
  @ApiProperty({ description: 'Місяць створення звіту', example: 12 })
  @IsNumber()
  readonly monthOfReport: number;

  @ApiProperty({ description: 'Рік створення звіту', example: 2024 })
  @IsNumber()
  readonly yearOfReport: number;

  @ApiProperty({ description: 'Статус звіту за поточний місяць', example: false })
  @IsBoolean()
  readonly closed: boolean;
}
