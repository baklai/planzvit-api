import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ description: 'Місяць створення звіту', example: 12 })
  @IsNumber()
  readonly monthOfReport: number;

  @ApiProperty({ description: 'Рік створення звіту', example: 2024 })
  @IsNumber()
  readonly yearOfReport: number;

  @ApiProperty({ description: 'Ідентифікатор відділу', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  readonly department: string;

  @ApiProperty({ description: 'Ідентифікатор сервісу', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  readonly service: string;

  @ApiProperty({ description: 'Ідентифікатор служби/філії', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  readonly branch: string;

  @ApiProperty({ description: 'Ідентифікатор підрозділу', example: '6299b5cebf44864bfcea37a5' })
  @IsString()
  @IsMongoId()
  readonly subdivision: string;

  @ApiPropertyOptional({ description: 'Кількість робіт - попередній місяць', example: 50 })
  @IsNumber()
  @IsOptional()
  readonly jobsPreviousMonth: number;

  @ApiPropertyOptional({ description: 'Кількість нових робіт за поточний місяць', example: -5 })
  @IsNumber()
  @IsOptional()
  readonly jobsCurrentMonth: number;

  @ApiPropertyOptional({ description: 'Кількість робіт всього на поточний місяць', example: 45 })
  @IsNumber()
  @IsOptional()
  readonly jobsTotalCurrentMonth: number;
}
