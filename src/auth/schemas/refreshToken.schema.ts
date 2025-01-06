import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Profile } from 'src/profiles/schemas/profile.schema';

@Schema()
export class RefreshToken {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
    unique: true,
    trim: true,
    autopopulate: false
  })
  profile: Profile;

  @Prop({ type: String, required: true, unique: true, trim: true })
  refreshToken: string;
}

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
