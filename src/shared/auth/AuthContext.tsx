import { createContext, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@/shared/api/httpClient'
import { clearTokens, getTokens, setTokens } from '@/shared/auth/authStorage'
import type { LoginResponse, UserRole } from '@/types/api'

export interface AuthUser {
  fullName: string
  role: UserRole
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

function readUser(): AuthUser | null {
  const t = getTokens()
  return t ? { fullName: t.fullName, role: t.role } : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUser)

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiFetch<LoginResponse>('/identity/auth/login', {
      method: 'POST',
      body: { username, password },
      skipAuth: true,
    })
    setTokens(res)
    setUser({ fullName: res.fullName, role: res.role })
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
