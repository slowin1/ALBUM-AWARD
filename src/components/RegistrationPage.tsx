import { useState, type FormEvent, type MouseEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAllRatingsStats } from '../hooks/useAlbumRatings'
import { FluidBackground } from './FluidBackground'
import './RegistrationPage.css'

export type RegistrationPageProps = {
  onNavigateToGallery: () => void
  onNavigateToTracks: () => void
  onNavigateToProfile?: () => void
}

export function RegistrationPage({ onNavigateToGallery, onNavigateToTracks, onNavigateToProfile }: RegistrationPageProps) {
  const { user, isAuthenticated, register, login, logout } = useAuth()
  const { ratingsCount, reviewsCount } = useAllRatingsStats()

  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successNote, setSuccessNote] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (mode === 'register') {
      const cleanNick = nickname.trim()
      const cleanEmail = email.trim()
      if (!cleanNick) {
        setError('Укажи свой никнейм для рецензий')
        return
      }
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setError('Укажи корректный email')
        return
      }
      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов')
        return
      }
      const ok = register(cleanNick, cleanEmail)
      if (ok) {
        setSuccessNote(`Добро пожаловать, ${cleanNick}! Аккаунт успешно создан.`)
      } else {
        setError('Не удалось сохранить профиль, проверь настройки браузера')
      }
    } else {
      const cleanEmail = email.trim()
      if (!cleanEmail) {
        setError('Укажи email или никнейм')
        return
      }
      const ok = login(cleanEmail)
      if (ok) {
        setSuccessNote('Вы успешно вошли в профиль!')
      } else {
        setError('Не удалось войти в аккаунт')
      }
    }
  }

  function handleSocialLogin(provider: 'telegram' | 'vk' | 'apple' | 'google', defaultNick: string) {
    setError(null)
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    const nick = `${defaultNick}_${randomSuffix}`
    const mail = `${nick.toLowerCase()}@${provider}.auth`
    register(nick, mail, provider)
    setSuccessNote(`Вы вошли через ${provider.toUpperCase()} как ${nick}`)
  }

  function handleLogout(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    logout()
    setSuccessNote('Вы вышли из аккаунта')
    setNickname('')
    setPassword('')
  }

  return (
    <main className="registration-page" role="main">
      <FluidBackground />

      <section className="registration-card" aria-labelledby="registration-title">
        <div className="registration-card-glow" aria-hidden="true" />

        <div className="registration-visual-side">
          <img
            className="registration-visual-image"
            src="/registration-banner.jpg"
            alt="Album Awards Castle"
          />
          <div className="registration-visual-overlay" aria-hidden="true" />

          <div className="registration-visual-content">
            <div className="registration-visual-header">
              <img className="registration-visual-logo" src="/logo-transparent.png" alt="Album Awards" />
              <span className="registration-visual-badge">2026</span>
            </div>

            <div className="registration-visual-body">
              <h2 className="registration-visual-title">
                {mode === 'register' ? 'Создай аккаунт' : 'С возвращением'}
              </h2>
            </div>
          </div>
        </div>

        <div className="registration-form-side">
          {isAuthenticated && user ? (
            <div className="registration-profile-view">
              <div className="registration-avatar">
                <span>{user.nickname.slice(0, 2).toUpperCase()}</span>
              </div>

              <h1 id="registration-title" className="registration-title">
                {user.nickname}
              </h1>
              <p className="registration-subtitle">{user.email}</p>

              <div className="registration-stats">
                <div className="registration-stat-item">
                  <span className="registration-stat-value">{ratingsCount}</span>
                  <span className="registration-stat-label">Оценок</span>
                </div>
                <div className="registration-stat-item">
                  <span className="registration-stat-value">{reviewsCount}</span>
                  <span className="registration-stat-label">Рецензий</span>
                </div>
              </div>

              <div className="registration-profile-actions">
                {onNavigateToProfile && (
                  <button
                    type="button"
                    className="registration-submit-btn"
                    onClick={onNavigateToProfile}
                  >
                    Открыть мой профиль →
                  </button>
                )}
                <button
                  type="button"
                  className={onNavigateToProfile ? 'registration-secondary-btn' : 'registration-submit-btn'}
                  onClick={onNavigateToTracks}
                >
                  Оценивать треки
                </button>
                <button
                  type="button"
                  className="registration-secondary-btn"
                  onClick={onNavigateToGallery}
                >
                  К альбомам
                </button>
                <button
                  type="button"
                  className="registration-logout-btn"
                  onClick={handleLogout}
                >
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 id="registration-title" className="registration-title">
                {mode === 'register' ? 'Создать аккаунт' : 'Вход'}
              </h1>

              {successNote && (
                <div className="registration-message is-success" role="status">
                  {successNote}
                </div>
              )}

              {error && (
                <div className="registration-message is-error" role="alert">
                  {error}
                </div>
              )}

              <form className="registration-form" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="registration-field">
                    <input
                      id="reg-nickname"
                      type="text"
                      required
                      placeholder="Никнейм"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                )}

                <div className="registration-field">
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="registration-field">
                  <input
                    id="reg-password"
                    type="password"
                    required
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  />
                </div>

                <button type="submit" className="registration-submit-btn">
                  {mode === 'register' ? 'Зарегистрироваться →' : 'Войти →'}
                </button>
              </form>

              <div className="registration-divider">
                <span>или</span>
              </div>

              <div className="registration-socials">
                <button
                  type="button"
                  className="registration-social-btn"
                  onClick={() => handleSocialLogin('telegram', 'tg_user')}
                  title="Войти через Telegram"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  <span>Telegram</span>
                </button>

                <button
                  type="button"
                  className="registration-social-btn"
                  onClick={() => handleSocialLogin('google', 'google_user')}
                  title="Войти через Google"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="registration-social-btn"
                  onClick={() => handleSocialLogin('apple', 'apple_user')}
                  title="Войти через Apple"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.63 1.35-.57.65-.98 1.72-.85 2.74 1.01.08 2.03-.5 2.56-1.24z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              <div className="registration-toggle">
                {mode === 'register' ? (
                  <button
                    type="button"
                    className="registration-toggle-btn"
                    onClick={() => { setMode('login'); setError(null) }}
                  >
                    Есть аккаунт? Войти ↗
                  </button>
                ) : (
                  <button
                    type="button"
                    className="registration-toggle-btn"
                    onClick={() => { setMode('register'); setError(null) }}
                  >
                    Нет аккаунта? Создать ↗
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
