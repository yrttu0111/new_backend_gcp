import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '2w' },
    );
    // 개발환경
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; SameSite=None; Secure; httpOnly;`
    ); // path 설정 필수 (소셜로그인)
    // 배포환경
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')
    // res.setHeader(
    //   'Set-Cookie',
    //   `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`
    // )
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '1h' },
    );
  }
  async loginOauth({ req, res }) {
    // 1. 가입확인
    let user = await this.userService.findOne({ email: req.user.email });

    // 2. 회원가입(가입 안되있을 시)
    if (!user) {
      const { password, ...rest } = req.user;
      const createUser = { ...rest, hashedPassword: password };
      user = await this.userService.create({ ...createUser });
    }
    console.log(user);

    // 3. 로그인
    this.setRefreshToken({ user, res });

    res.redirect(
      'http://localhost/main.html',
    );
  }

  async blackList({ context }) {
    //로그아웃을 위한 토큰 블랙리스트

    // 1. 토큰 전처리 (access, refresh) 만료시간 계산 -> ttl
    const now = new Date();
    const access = context.req.headers.authorization.replace('Bearer ', '');
    const access_decoded = this.jwtService.decode(access);
    const access_time = new Date(access_decoded['exp'] * 1000);
    const access_end = Math.floor(
      (access_time.getTime() - now.getTime()) / 1000,
    );
    
    
    const refresh = context.req.headers.cookie.replace('refreshToken=', '');
    const refresh_decoded = this.jwtService.decode(refresh);
    const refresh_time = new Date(refresh_decoded['exp'] * 1000);
    const refresh_end = Math.floor(
      (refresh_time.getTime() - now.getTime()) / 1000,
    );
    
    // 2. 블랙리스트에 저장 레디스
    try {
      jwt.verify(access, process.env.ACCESS_TOKEN_KEY);
      jwt.verify(refresh, process.env.REFRESH_TOKEN_KEY);
      await this.cacheManager.set(access, 'accessToken', { ttl: access_end });
      await this.cacheManager.set(refresh, 'refreshToken', {
        ttl: refresh_end,
      });// 
      return '로그아웃에 성공했습니다';

      // 3. 블랙리스트에 저장된 토큰은 사용 불가 
    } catch {
      throw new UnauthorizedException();
    }
  }
}

