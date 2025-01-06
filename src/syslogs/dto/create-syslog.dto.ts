import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSyslogDto {
  @ApiPropertyOptional({
    description: 'IP-адреса запиту',
    example: '127.0.0.1'
  })
  @IsString()
  @IsOptional()
  readonly host: string;

  @ApiPropertyOptional({
    description: 'ID профілю',
    example: '6299b5cebf44864bfcea36d4'
  })
  @IsString()
  @IsOptional()
  readonly profile: string;

  @ApiPropertyOptional({
    description: 'Параметри запиту',
    example: '{"0":"profiles"}'
  })
  @IsString()
  @IsOptional()
  readonly params: string;

  @ApiPropertyOptional({
    description: 'Параметри запиту',
    example: '{"limit":"10","offset":"50"}'
  })
  @IsString()
  @IsOptional()
  readonly query: string;

  @ApiPropertyOptional({
    description: 'Тіло запиту',
    example: '{"name":"Cisco unit"}'
  })
  @IsString()
  @IsOptional()
  readonly body: string;

  @ApiPropertyOptional({
    description: 'Спосіб запиту',
    example: 'POST'
  })
  @IsString()
  @IsOptional()
  readonly method: string;

  @ApiPropertyOptional({
    description: 'Базовий url запиту',
    example: '/units?limit=10&offset=50'
  })
  @IsString()
  @IsOptional()
  readonly baseUrl: string;

  @ApiPropertyOptional({
    description: 'Статус запиту',
    example: 200
  })
  @IsNumber()
  @IsOptional()
  readonly status: number;

  @ApiPropertyOptional({
    description: 'Агент користувача',
    example: 200
  })
  @IsString()
  @IsOptional()
  readonly userAgent: string;
}
