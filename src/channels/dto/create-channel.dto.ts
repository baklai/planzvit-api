import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({ description: 'The location from', example: 'Headquarters' })
  @IsString()
  readonly locationFrom: string;

  @ApiProperty({ description: 'The unit from', example: 'Router TP-Link' })
  @IsString()
  readonly unitFrom: string;

  @ApiProperty({ description: 'The location to', example: 'Branch Office' })
  @IsString()
  readonly locationTo: string;

  @ApiProperty({ description: 'The unit to', example: 'Switch' })
  @IsString()
  readonly unitTo: string;

  @ApiProperty({ description: 'The level of channel', example: 'High' })
  @IsString()
  readonly level: string;

  @ApiProperty({ description: 'The type of channel', example: 'Fiber Optic' })
  @IsString()
  readonly type: string;

  @ApiProperty({ description: 'The speed of channel', example: '10 Gbps' })
  @IsString()
  readonly speed: string;

  @ApiProperty({ description: 'The status of channel', example: 'Active' })
  @IsString()
  readonly status: string;

  @ApiProperty({ description: 'The operator of channel', example: 'ISP' })
  @IsString()
  readonly operator: string;

  @ApiProperty({ description: 'The composition of channel', example: 'Single-mode' })
  @IsString()
  readonly composition: string;
}
