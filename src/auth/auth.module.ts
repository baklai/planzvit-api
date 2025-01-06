import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { Profile, ProfileSchema } from 'src/profiles/schemas/profile.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshToken, RefreshTokenSchema } from './schemas/refreshToken.schema';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    ConfigModule,
    ProfilesModule,
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ]),
    JwtModule.register({ global: true })
  ],
  controllers: [AuthController],
  providers: [ConfigService, AuthService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule {}
