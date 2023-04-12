import { User } from 'src/apis/users/entities/user.entity';
import { UserService } from '../users/user.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
//restAPI

interface IOauthUser {
  user: Pick<User, 'email' | 'password' | 'name' >;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() req: Request & IOauthUser, @Res() res: Response) {
    this.authService.loginOauth({ req, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(@Req() req: Request & IOauthUser, @Res() res: Response) {
    this.authService.loginOauth({ req, res });
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: Request & IOauthUser, @Res() res: Response) {
    this.authService.loginOauth({ req, res });
  }
}
