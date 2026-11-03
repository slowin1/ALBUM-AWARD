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
  nickname: string
  email: string
  provider?: 'email' | 'telegram' | 'vk' | 'apple' | 'google'
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
        nickname: parsed.nickname.trim(),
        email: parsed.email.trim(),
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

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)

  function register(nickname: string, email: string, provider: UserProfile['provider'] = 'email') {
    const cleanNick = nickname.trim()
    const cleanEmail = email.trim()
    if (!cleanNick || !cleanEmail) return false
    const profile: UserProfile = {
      nickname: cleanNick,
      email: cleanEmail,
      provider,
      registeredAt: new Date().toISOString(),
      preferences: getDefaultPreferences(),
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
      publish(profile)
      return true
    } catch {
      return false
    }
  }

  function login(emailOrNick: string) {
    const clean = emailOrNick.trim()
    if (!clean) return false
    // If existing in storage with matching or just log in with this handle
    const existing = readStorage()
    if (existing) {
      publish(existing)
      return true
    }
    // If no existing account yet, log in with provided name
    const profile: UserProfile = {
      nickname: clean.includes('@') ? clean.split('@')[0] : clean,
      email: clean.includes('@') ? clean : `${clean}@awards.music`,
      provider: 'email',
      registeredAt: new Date().toISOString(),
      preferences: getDefaultPreferences(),
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
      publish(profile)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      publish(null)
    } catch {
      // Ignore
    }
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
      return true
    } catch {
      return false
    }
  }

  return {
    user: state.user,
    isAuthenticated: state.user !== null,
    register,
    login,
    logout,
    updateProfile,
  }
}
