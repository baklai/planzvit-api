import {
  Controller,
  HttpStatus,
  UseGuards,
  HttpCode,
  Request,
  Body,
  Post,
  Get,
  Req
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { Profile } from 'src/profiles/schemas/profile.schema';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiBearerAuth('JWT Guard')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Отримати інформацію профілю' })
  @ApiOkResponse({ description: 'Успіх', type: Profile })
  async me(@Request() req: Record<string, any>): Promise<Profile> {
    return await this.authService.me(req.user.id);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Автентифікуйте профіль і створіть маркери доступу' })
  @ApiOkResponse({ description: 'Профіль успішно автентифікований', type: TokensDto })
  async signin(@Body() signinAuthDto: SigninAuthDto): Promise<TokensDto> {
    return await this.authService.signin(signinAuthDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Створіть новий обліковий запис профілю' })
  @ApiConflictResponse({ description: 'Електронна адреса з такою назвою вже існує' })
  @ApiBadRequestResponse({ description: 'Поганий запит' })
  @ApiOkResponse({ description: 'Успіх', type: Profile })
  async signup(@Body() signupAuthDto: SignupAuthDto): Promise<Profile> {
    return await this.authService.signup(signupAuthDto);
  }

  @Get('refresh')
  @ApiBearerAuth('JWT Guard')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Оновіть маркери доступу за допомогою дійсного маркера оновлення' })
  @ApiOkResponse({ description: 'Успіх', type: TokensDto })
  async refresh(@Req() req: Record<string, any>): Promise<TokensDto> {
    const profileId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refresh(profileId, refreshToken);
  }

  @Get('signout')
  @ApiBearerAuth('JWT Guard')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Вийдіть і анулюйте маркер доступу' })
  async signout(@Req() req: Record<string, any>) {
    return await this.authService.signout(req.user['id']);
  }
}
