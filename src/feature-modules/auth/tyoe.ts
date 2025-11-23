export type User = {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  roles: string[]
  isEmailVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export type Credentials = {
  email: string
  password: string
  remember?: boolean
}

export type AuthToken = {
  accessToken: string
  refreshToken?: string
  expiresAt?: number // epoch timestamp in ms
  tokenType?: "Bearer"
}

export type AuthState = {
  user: User | null
  tokens: AuthToken | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export type AuthContextValue = {
  state: AuthState
  login: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken?: () => Promise<void>
  updateUser?: (user: Partial<User>) => void
}
