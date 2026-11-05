import { ConflictException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';

export const getJwtSecret = () => process.env.JWT_SECRET || 'dev-only-secret-change-me';
const getJwtExpires = () => process.env.JWT_EXPIRES_IN || '7d';

export type RegisterDto = { nickname?: string; email?: string; password?: string };
export type LoginDto = { identifier?: string; password?: string };
export type UpdateProfileDto = {
  nickname?: string;
  bio?: string;
  avatarUrl?: string;
  avatarSymbol?: string;
  favoriteGenre?: string;
  preferences?: Record<string, unknown>;
};

const PREFERENCE_KEYS = ['artists', 'albums', 'tracks', 'producers', 'clipmakers', 'designers'] as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private sign(user: { id: string; role: string }) {
    return this.jwt.sign(
      { sub: user.id, role: user.role },
      { secret: getJwtSecret(), expiresIn: getJwtExpires() as any },
    );
  }

  private async toPublic(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const p: any = user.preferences;
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      role: user.role,
      provider: user.provider,
      bio: user.bio ?? '',
      avatarUrl: user.avatarUrl ?? '',
      avatarSymbol: user.avatarSymbol ?? '',
      favoriteGenre: user.favoriteGenre ?? '',
      registeredAt: user.createdAt.toISOString(),
      preferences: {
        artists: p?.artists ?? [],
        albums: p?.albums ?? [],
        tracks: p?.tracks ?? [],
        producers: p?.producers ?? [],
        clipmakers: p?.clipmakers ?? [],
        designers: p?.designers ?? [],
        soundEngineers: p?.soundengineers ?? [],
      },
    };
  }

  private isAdminEmail(email: string): boolean {
    const raw = process.env.ADMIN_EMAILS || '';
    if (!raw.trim()) return false;
    const list = raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    return list.includes(email.trim().toLowerCase());
  }

  async register(dto: RegisterDto) {
    const nickname = (dto.nickname ?? '').trim();
    const email = (dto.email ?? '').trim().toLowerCase();
    const password = dto.password ?? '';

    if (nickname.length < 2 || nickname.length > 32) {
      throw new BadRequestException('Никнейм должен быть от 2 до 32 символов');
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new BadRequestException('Некорректный email');
    }
    if (password.length < 6) {
      throw new BadRequestException('Пароль должен содержать минимум 6 символов');
    }

    const taken = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { nickname: { equals: nickname, mode: 'insensitive' } }] },
      select: { email: true },
    });
    if (taken) {
      throw new ConflictException(
        taken.email === email ? 'Этот email уже зарегистрирован' : 'Этот никнейм уже занят',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = this.isAdminEmail(email) ? 'admin' : 'user';
    const user = await this.prisma.user.create({
      data: { nickname, email, passwordHash, role, provider: 'local', preferences: { create: {} } },
    });

    return { token: this.sign(user), user: await this.toPublic(user.id) };
  }

  async login(dto: LoginDto) {
    const identifier = (dto.identifier ?? '').trim();
    const password = dto.password ?? '';
    if (!identifier || !password) {
      throw new BadRequestException('Укажи email/никнейм и пароль');
    }

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { nickname: { equals: identifier, mode: 'insensitive' } },
        ],
      },
    });
    // Одинаковая ошибка для "нет пользователя" и "неверный пароль" — чтобы не раскрывать, какие email существуют
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Неверный email/никнейм или пароль');
    }

    if (user.role !== 'admin' && this.isAdminEmail(user.email)) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' },
      });
    }

    return { token: this.sign(user), user: await this.toPublic(user.id) };
  }

  private googleClient: OAuth2Client | null = null;

  async loginWithGoogle(credential?: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new BadRequestException('Вход через Google не настроен на сервере (GOOGLE_CLIENT_ID)');
    }
    if (!credential) throw new BadRequestException('Не передан Google credential');

    this.googleClient ??= new OAuth2Client(clientId);
    let payload;
    try {
      // Проверяет подпись, срок действия и что токен выпущен именно для нашего Client ID
      const ticket = await this.googleClient.verifyIdToken({ idToken: credential, audience: clientId });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Google-токен недействителен');
    }
    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('Email в аккаунте Google не подтверждён');
    }

    const email = payload.email.toLowerCase();
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const nickname = await this.uniqueNickname(payload.name || email.split('@')[0]);
      const role = this.isAdminEmail(email) ? 'admin' : 'user';
      user = await this.prisma.user.create({
        data: {
          nickname,
          email,
          role,
          provider: 'google',
          avatarUrl: payload.picture ?? null,
          preferences: { create: {} },
        },
      });
    } else if (user.role !== 'admin' && this.isAdminEmail(email)) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { role: 'admin' },
      });
    }

    return { token: this.sign(user), user: await this.toPublic(user.id) };
  }

  private async uniqueNickname(raw: string) {
    const base = (raw.replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_.-]/gu, '').slice(0, 26) || 'user');
    let candidate = base;
    for (let i = 0; i < 20; i++) {
      const taken = await this.prisma.user.findFirst({
        where: { nickname: { equals: candidate, mode: 'insensitive' } },
        select: { id: true },
      });
      if (!taken) return candidate;
      candidate = `${base}_${Math.floor(100 + Math.random() * 9000)}`;
    }
    return `${base}_${Date.now()}`.slice(0, 32);
  }

  me(userId: string) {
    return this.toPublic(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: Record<string, unknown> = {};
    if (dto.nickname !== undefined) {
      const nickname = dto.nickname.trim();
      if (nickname.length < 2 || nickname.length > 32) {
        throw new BadRequestException('Никнейм должен быть от 2 до 32 символов');
      }
      const taken = await this.prisma.user.findFirst({
        where: { nickname: { equals: nickname, mode: 'insensitive' }, NOT: { id: userId } },
        select: { id: true },
      });
      if (taken) throw new ConflictException('Этот никнейм уже занят');
      data.nickname = nickname;
    }
    for (const key of ['bio', 'avatarUrl', 'avatarSymbol', 'favoriteGenre'] as const) {
      if (dto[key] !== undefined) data[key] = dto[key];
    }
    if (Object.keys(data).length) {
      await this.prisma.user.update({ where: { id: userId }, data });
    }

    if (dto.preferences) {
      const prefs: Record<string, any> = {};
      for (const key of PREFERENCE_KEYS) {
        if (dto.preferences[key] !== undefined) prefs[key] = dto.preferences[key];
      }
      if (dto.preferences.soundEngineers !== undefined) prefs.soundengineers = dto.preferences.soundEngineers;
      await this.prisma.preference.upsert({
        where: { userId },
        create: { userId, ...prefs },
        update: prefs,
      });
    }

    return this.toPublic(userId);
  }
}
