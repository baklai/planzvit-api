import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';
import { Branch } from 'src/branches/schemas/branch.schema';
import { Department } from 'src/departments/schemas/department.schema';
import { Service } from 'src/services/schemas/service.schema';
import { Subdivision } from 'src/subdivisions/schemas/subdivision.schema';

export class CreateArchiveDto {
  @ApiProperty({ description: 'Дата створення', example: new Date() })
  @IsDate()
  readonly completedAt: Date;

  @ApiProperty({ description: 'Ідентифікатор відділу' })
  readonly department: Department;

  @ApiProperty({ description: 'Ідентифікатор сервісу' })
  readonly service: Service;

  @ApiProperty({ description: 'Ідентифікатор служби/філії' })
  readonly branch: Branch;

  @ApiProperty({ description: 'Ідентифікатор підрозділу' })
  readonly subdivision: Subdivision;

  @ApiProperty({ description: 'Кількість робіт за попередній місяць' })
  @IsNumber()
  readonly previousJobCount: number;

  @ApiProperty({ description: 'Кількість нових робіт за поточний місяць' })
  @IsNumber()
  readonly changesJobCount: number;

  @ApiPropertyOptional({ description: 'Кількість робіт всього на поточний місяць' })
  @IsNumber()
  readonly currentJobCount: number;
}
