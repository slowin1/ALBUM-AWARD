import { useSyncExternalStore } from 'react'

export type PreferenceItem = {
  id: string
  name: string
  subtitle?: string
  cover?: string
}

export type UserPreferences = {
  artists: PreferenceItem[]
  albums: PreferenceItem[]
  producers: PreferenceItem[]
  tracks: PreferenceItem[]
  clipmakers?: PreferenceItem[]
  designers?: PreferenceItem[]
  soundEngineers?: PreferenceItem[]
}

export function getDefaultPreferences(): UserPreferences {
  return {
    artists: [],
    albums: [],
    producers: [],
    tracks: [],
    clipmakers: [],
    designers: [],
    soundEngineers: [],
  }
}

export type UserProfile = {
  id?: string
  nickname: string
  email: string
  role?: 'user' | 'admin' | string
  provider?: 'email' | 'local' | 'google'
  registeredAt: string
  bio?: string
  avatarSymbol?: string
  avatarUrl?: string
  favoriteGenre?: string
  preferences?: UserPreferences
}

type Snapshot = { user: UserProfile | null }
const serverSnapshot: Snapshot = { user: null }
let snapshot: Snapshot = serverSnapshot
const listeners = new Set<() => void>()

function publish(user: UserProfile | null) {
  snapshot = { user }
  for (const listener of listeners) listener()
}

function getSnapshot() {
  return snapshot
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// Токен живёт только в памяти; между перезагрузками сессию хранит httpOnly-cookie на сервере.
let memoryToken: string | null = null
const API_AUTH = '/api/auth'

export function getAuthToken(): string | null {
  return memoryToken
}

export type AuthResult = { ok: true } | { ok: false; error: string }

function saveSession(token: string, user: UserProfile) {
  memoryToken = token
  publish(user)
  try {
    window.dispatchEvent(new CustomEvent('aa:auth_login'))
  } catch {}
}

function clearSession() {
  memoryToken = null
  void fetch(`${API_AUTH}/logout`, { method: 'POST' }).catch(() => {})
  publish(null)
}

async function authRequest(path: string, body: unknown): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_AUTH}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const message = Array.isArray(data.message) ? data.message.join(', ') : data.message
      return { ok: false, error: message || 'Ошибка сервера' }
    }
    saveSession(data.token, data.user)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Сервер недоступен. Проверь, что бэкенд запущен' }
  }
}

// Восстанавливаем сессию по cookie при старте: сервер возвращает токен и свежий профиль.
let sessionChecked = false
async function verifySession() {
  if (sessionChecked || typeof window === 'undefined') return
  sessionChecked = true
  try {
    const res = await fetch(`${API_AUTH}/session`)
    if (!res.ok) return
    const data = await res.json()
    if (data?.token && data?.user) saveSession(data.token, data.user)
  } catch {
    // Бэкенд недоступен — остаёмся гостем
  }
}
if (typeof window !== 'undefined') void verifySession()

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)

  function register(nickname: string, email: string, password: string): Promise<AuthResult> {
    return authRequest('register', { nickname, email, password })
  }

  function login(identifier: string, password: string): Promise<AuthResult> {
    return authRequest('login', { identifier, password })
  }

  function loginWithGoogle(credential: string): Promise<AuthResult> {
    return authRequest('google', { credential })
  }

  function logout() {
    clearSession()
  }

  function updateProfile(updates: Partial<UserProfile>) {
    const current = snapshot.user
    if (!current) return false
    const updated: UserProfile = {
      ...current,
      ...updates,
      nickname: updates.nickname ? updates.nickname.trim() : current.nickname,
      bio: updates.bio !== undefined ? updates.bio.trim() : current.bio,
      avatarSymbol: updates.avatarSymbol !== undefined ? updates.avatarSymbol : current.avatarSymbol,
      avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : current.avatarUrl,
      favoriteGenre: updates.favoriteGenre !== undefined ? updates.favoriteGenre.trim() : current.favoriteGenre,
      preferences: updates.preferences !== undefined ? updates.preferences : (current.preferences ?? getDefaultPreferences()),
    }
    publish(updated)

    // Sync to the server when signed in with a JWT (best effort; local cache stays the source for the UI).
    const token = getAuthToken()
    if (token) {
      void fetch(`${API_AUTH}/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          nickname: updated.nickname,
          bio: updated.bio,
          avatarUrl: updated.avatarUrl,
          avatarSymbol: updated.avatarSymbol,
          favoriteGenre: updated.favoriteGenre,
          preferences: updated.preferences,
        }),
      }).catch(() => {})
    }
    return true
  }

  return {
    user: state.user,
    isAuthenticated: state.user !== null,
    isAdmin: state.user?.role === 'admin',
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
  }
}
