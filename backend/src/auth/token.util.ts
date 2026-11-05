import type { Response } from 'express';

export const SESSION_COOKIE = 'aa_session';

/** JWT из заголовка Authorization или из httpOnly-cookie сессии. */
export function readToken(req: { headers: Record<string, any> }): string | null {
  const header: string = req.headers['authorization'] ?? '';
  const [scheme, bearer] = header.split(' ');
  if (scheme === 'Bearer' && bearer) return bearer;
  const cookies: string = req.headers['cookie'] ?? '';
  for (const part of cookies.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === SESSION_COOKIE && rest.length) return decodeURIComponent(rest.join('='));
  }
  return null;
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}
