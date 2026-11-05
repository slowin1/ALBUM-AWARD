import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAllRatingsStats } from '../hooks/useAlbumRatings'
import { FluidBackground } from './FluidBackground'
import './RegistrationPage.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
      renderButton: (el: HTMLElement, options: Record<string, unknown>) => void
    }
  }
}

function loadGoogleScript(): Promise<GoogleIdentity> {
  const w = window as unknown as { google?: GoogleIdentity }
  if (w.google?.accounts) return Promise.resolve(w.google)
  return new Promise((resolve, reject) => {
    const existing = document.getElementById('google-gsi') as HTMLScriptElement | null
    const script = existing ?? document.createElement('script')
    script.addEventListener('load', () => (w.google ? resolve(w.google) : reject(new Error('no google'))))
    script.addEventListener('error', () => reject(new Error('load failed')))
    if (!existing) {
      script.id = 'google-gsi'
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      document.head.appendChild(script)
    }
  })
}

export type RegistrationPageProps = {
  onNavigateToGallery: () => void
  onNavigateToTracks: () => void
  onNavigateToProfile?: () => void
}

export function RegistrationPage({ onNavigateToGallery, onNavigateToTracks, onNavigateToProfile }: RegistrationPageProps) {
  const { user, isAuthenticated, register, login, loginWithGoogle, logout } = useAuth()
  const { ratingsCount, reviewsCount } = useAllRatingsStats()

  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successNote, setSuccessNote] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccessNote(null)

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
      setSubmitting(true)
      const result = await register(cleanNick, cleanEmail, password)
      setSubmitting(false)
      if (result.ok) {
        setPassword('')
        setSuccessNote(`Добро пожаловать, ${cleanNick}! Аккаунт успешно создан.`)
      } else {
        setError(result.error)
      }
    } else {
      const cleanEmail = email.trim()
      if (!cleanEmail) {
        setError('Укажи email или никнейм')
        return
      }
      if (!password) {
        setError('Введи пароль')
        return
      }
      setSubmitting(true)
      const result = await login(cleanEmail, password)
      setSubmitting(false)
      if (result.ok) {
        setPassword('')
        setSuccessNote('Вы успешно вошли в профиль!')
      } else {
        setError(result.error)
      }
    }
  }

  function handleLogout(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    logout()
    setSuccessNote('Вы вышли из аккаунта')
    setNickname('')
    setPassword('')
  }

  const googleBtnRef = useRef<HTMLDivElement>(null)
  const showForm = !(isAuthenticated && user)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !showForm) return
    let cancelled = false
    loadGoogleScript()
      .then(google => {
        if (cancelled || !googleBtnRef.current) return
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async ({ credential }) => {
            setError(null)
            const result = await loginWithGoogle(credential)
            if (result.ok) setSuccessNote('Вы вошли через Google!')
            else setError(result.error)
          },
        })
        google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 280,
        })
      })
      .catch(() => setError('Не удалось загрузить Google. Проверь соединение'))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm])

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
                    type={mode === 'register' ? 'email' : 'text'}
                    required
                    placeholder={mode === 'register' ? 'Email' : 'Email или никнейм'}
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

                <button type="submit" className="registration-submit-btn" disabled={submitting}>
                  {submitting ? 'Подождите…' : mode === 'register' ? 'Зарегистрироваться →' : 'Войти →'}
                </button>
              </form>

              <div className="registration-divider">
                <span>или</span>
              </div>

              <div className="registration-socials">
                {GOOGLE_CLIENT_ID ? (
                  <div ref={googleBtnRef} className="registration-google-btn" />
                ) : (
                  <p className="registration-subtitle">Вход через Google не настроен (нет VITE_GOOGLE_CLIENT_ID)</p>
                )}
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
