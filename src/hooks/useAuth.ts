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

const STORAGE_KEY = 'album-awards-auth-v1'

type Snapshot = { user: UserProfile | null }
const serverSnapshot: Snapshot = { user: null }
let snapshot: Snapshot = serverSnapshot
let initialized = false
const listeners = new Set<() => void>()

function readStorage(): UserProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.nickname === 'string' && typeof parsed.email === 'string') {
      return {
        id: typeof parsed.id === 'string' ? parsed.id : undefined,
        nickname: parsed.nickname.trim(),
        email: parsed.email.trim(),
        role: typeof parsed.role === 'string' ? parsed.role : 'user',
        provider: parsed.provider || 'email',
        registeredAt: parsed.registeredAt || new Date().toISOString(),
        bio: typeof parsed.bio === 'string' ? parsed.bio : '',
        avatarSymbol: typeof parsed.avatarSymbol === 'string' ? parsed.avatarSymbol : '',
        avatarUrl: typeof parsed.avatarUrl === 'string' ? parsed.avatarUrl : '',
        favoriteGenre: typeof parsed.favoriteGenre === 'string' ? parsed.favoriteGenre : '',
        preferences: parsed.preferences && typeof parsed.preferences === 'object' && Array.isArray(parsed.preferences.artists)
          ? parsed.preferences
          : getDefaultPreferences(),
      }
    }
  } catch {
    // Ignore corrupt storage
  }
  return null
}

function publish(user: UserProfile | null) {
  snapshot = { user }
  for (const listener of listeners) listener()
}

function getSnapshot() {
  if (!initialized) {
    initialized = true
    snapshot = { user: readStorage() }
  }
  return snapshot
}

function syncStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return
  publish(readStorage())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('storage', syncStorage)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', syncStorage)
    }
  }
}

const TOKEN_KEY = 'album-awards-token'
const API_AUTH = '/api/auth'

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export type AuthResult = { ok: true } | { ok: false; error: string }

function saveSession(token: string, user: UserProfile) {
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  publish(user)
  try {
    window.dispatchEvent(new CustomEvent('aa:auth_login'))
  } catch {}
}

function clearSession() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
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

// Validate stored token on startup: pull a fresh profile or drop an expired session.
let sessionChecked = false
async function verifySession() {
  if (sessionChecked) return
  sessionChecked = true
  const token = getAuthToken()
  if (!token) return
  try {
    const res = await fetch(`${API_AUTH}/me`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.status === 401) return clearSession()
    if (res.ok) {
      const user = await res.json()
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      publish(user)
    }
  } catch {
    // Backend offline: keep the cached profile
  }
}

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
  void verifySession()

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
    const current = readStorage()
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
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      publish(updated)
    } catch {
      return false
    }

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
