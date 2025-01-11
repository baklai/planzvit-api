import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateReportDto {
  @ApiProperty({ description: 'Кількість нових робіт за поточний місяць', example: -5 })
  @IsNumber()
  readonly currentMonthJobChanges: number;

  @ApiProperty({ description: 'Кількість робіт всього на поточний місяць', example: 45 })
  @IsNumber()
  readonly currentMonthJobCount: number;
}
