import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { getJwtSecret } from './auth.service';
import { readToken } from './token.util';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = readToken(req);
    if (!token) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    let payload: { sub: string; role?: string };
    try {
      payload = this.jwt.verify(token, { secret: getJwtSecret() });
    } catch {
      throw new UnauthorizedException('Токен недействителен или истёк');
    }

    // Проверяем актуальную роль в базе данных для мгновенного применения прав
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, role: true, email: true },
      });
      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }
      if (user.role !== 'admin') {
        throw new ForbiddenException('Доступ разрешён только администраторам (role: admin)');
      }
      req.user = { id: user.id, role: user.role, email: user.email };
      return true;
    } catch (err) {
      if (err instanceof ForbiddenException || err instanceof UnauthorizedException) {
        throw err;
      }
      // Если база временно недоступна, проверяем роль из подписанного JWT токена
      if (payload.role !== 'admin') {
        throw new ForbiddenException('Доступ разрешён только администраторам (role: admin)');
      }
      req.user = { id: payload.sub, role: payload.role };
      return true;
    }
  }
}
