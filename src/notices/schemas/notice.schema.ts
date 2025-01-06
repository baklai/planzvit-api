import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsDate, IsOptional } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

import { Profile } from 'src/profiles/schemas/profile.schema';

@Schema()
export class Notice {
  @ApiProperty({
    description: 'ID запису (унікальний)',
    example: '6299b5cebf44864bfcea36d4'
  })
  @IsString()
  @IsMongoId()
  readonly id: string;

  @ApiProperty({
    description: 'Назва повідомлення',
    example: 'Важливе оголошення'
  })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly title: string;

  @ApiProperty({
    description: 'Текст повідомлення',
    example: 'Повідомляємо про майбутні ремонтні роботи на...'
  })
  @IsString()
  @Prop({ type: String, required: true, trim: true })
  readonly text: string;

  @ApiProperty({
    description: 'Ідентифікатор профілю, пов’язаний зі сповіщенням',
    example: '6299b5cebf44864bfcea37a5'
  })
  @IsString()
  @IsMongoId()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
    autopopulate: false
  })
  readonly profile: Profile;

  @ApiPropertyOptional({
    description: 'Дата створення запису',
    example: new Date()
  })
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @ApiPropertyOptional({
    description: 'Дата оновлення запису',
    example: new Date()
  })
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

export type NoticeDocument = HydratedDocument<Notice>;

export const NoticeSchema = SchemaFactory.createForClass(Notice);
