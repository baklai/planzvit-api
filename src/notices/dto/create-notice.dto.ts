import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsMongoId, IsString } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({
    description: 'Назва повідомлення',
    example: 'Важливе оголошення'
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Текст повідомлення',
    example: 'Повідомляємо про майбутні ремонтні роботи на...'
  })
  @IsString()
  readonly text: string;

  @ApiProperty({
    description: 'Ідентифікатор профілю, пов’язаний зі сповіщенням',
    example: '["6299b5cebf44864bfcea37a5"]'
  })
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  @Type(() => String)
  readonly profiles: string[];
}
