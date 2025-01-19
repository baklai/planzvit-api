import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';

import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile, ProfileRole } from 'src/profiles/schemas/profile.schema';

import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { TokensDto } from './dto/tokens.dto';
import { RefreshToken } from './schemas/refreshToken.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly profilesService: ProfilesService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async me(id: string): Promise<Profile> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Недійсний ідентифікатор профілю');
    }

    const profile = await this.profileModel.findById(id).exec();

    if (!profile) {
      throw new NotFoundException('Профіль не знайдено');
    }

    return profile;
  }

  async signin({ email, password }: SigninAuthDto): Promise<TokensDto> {
    const profile = await this.profileModel.findOne({ email }, '+password').exec();

    if (!profile) {
      throw new BadRequestException('Профіль не існує');
    }

    if (!profile?.isActivated) {
      throw new UnauthorizedException('Обліковий запис профілю вимкнено');
    }

    const passwordMatches = await bcrypt.compare(password, profile.password);

    if (!passwordMatches) {
      throw new BadRequestException('Пароль неправильний');
    }

    const tokens = await this.generateTokens(
      profile.id,
      profile.email,
      profile.fullname,
      profile.isActivated,
      profile.role
    );

    await this.updateRefreshToken(profile.id, tokens.refreshToken);

    return tokens;
  }

  async signup(signupAuthDto: SignupAuthDto): Promise<Profile> {
    const profileExists = await this.profileModel.findOne({ email: signupAuthDto.email }).exec();

    if (profileExists) {
      throw new ConflictException('Профіль вже існує');
    }

    const passwordHash = await bcrypt.hash(
      signupAuthDto.password,
      Number(this.configService.get<number>('BCRYPT_SALT'))
    );

    try {
      const profile = await this.profileModel.create({
        ...signupAuthDto,
        password: passwordHash,
        isActivated: false,
        role: ProfileRole.USER
      });

      return await this.profileModel.findById(profile.id).exec();
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async signout(profile: string) {
    await this.refreshTokenModel.findOneAndDelete({ profile });
    return;
  }

  async refresh(id: string, refreshToken: string) {
    const profile = await this.profileModel.findById(id).exec();

    const rtStore = await this.refreshTokenModel.findOne({ profile: id });

    if (!profile || !profile?.isActivated || !rtStore?.refreshToken) {
      throw new UnauthorizedException();
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, rtStore.refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(
      profile.id,
      profile.email,
      profile.fullname,
      profile.isActivated,
      profile.role
    );

    await this.updateRefreshToken(profile.id, tokens.refreshToken);

    return tokens;
  }

  async generateTokens(
    id: string,
    email: string,
    fullname: string,
    isActivated: boolean,
    role: string
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id, email, fullname, isActivated, role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN')
        }
      ),
      this.jwtService.signAsync(
        { id, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')
        }
      )
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(profileId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      Number(this.configService.get<number>('BCRYPT_SALT'))
    );

    await this.refreshTokenModel
      .findOneAndUpdate(
        { profile: profileId },
        { profile: profileId, refreshToken: hashedRefreshToken },
        { new: true, upsert: true }
      )
      .exec();
  }
}
