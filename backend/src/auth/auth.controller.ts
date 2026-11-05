import { Body, Controller, Get, HttpCode, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService, LoginDto, RegisterDto, UpdateProfileDto } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { clearSessionCookie, readToken, setSessionCookie } from './token.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private async withCookie(res: Response, result: Promise<{ token: string; user: unknown }>) {
    const data = await result;
    setSessionCookie(res, data.token);
    return data;
  }

  @Post('register')
  register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.withCookie(res, this.auth.register(body) as any);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.withCookie(res, this.auth.login(body) as any);
  }

  @Post('google')
  @HttpCode(200)
  google(@Body() body: { credential?: string }, @Res({ passthrough: true }) res: Response) {
    return this.withCookie(res, this.auth.loginWithGoogle(body?.credential) as any);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    clearSessionCookie(res);
    return { ok: true };
  }

  /** Восстановление сессии после перезагрузки страницы: cookie → токен + профиль. */
  @Get('session')
  @UseGuards(JwtAuthGuard)
  async session(@Req() req: { user: { id: string }; headers: Record<string, any> }) {
    return { token: readToken(req), user: await this.auth.me(req.user.id) };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: { id: string } }) {
    return this.auth.me(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@Req() req: { user: { id: string } }, @Body() body: UpdateProfileDto) {
    return this.auth.updateProfile(req.user.id, body);
  }
}
