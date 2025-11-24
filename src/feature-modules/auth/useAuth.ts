import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { User, Credentials, AuthToken } from './type'

// Auth state
const user = ref<User | null>(null)
const token = ref<AuthToken | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Computed
const isAuthenticated = computed(() => !!user.value && !!token.value)

// Load auth from localStorage on init
const loadAuthFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('authUser')
    const storedToken = localStorage.getItem('authToken')
    
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
    
    if (storedToken) {
      token.value = {
        accessToken: storedToken,
        tokenType: 'Bearer'
      }
    }
  } catch (err) {
    console.error('Failed to load auth from storage:', err)
    clearAuth()
  }
}

// Clear auth
const clearAuth = () => {
  user.value = null
  token.value = null
  localStorage.removeItem('authUser')
  localStorage.removeItem('authToken')
}

// Sign up
export const useSignUp = () => {
  const router = useRouter()
  
  const signUp = async (credentials: {
    username: string
    email: string
    password: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('https://yourapi.com/signup', credentials)
      
      // Store token if provided
      if (response.data.token) {
        token.value = {
          accessToken: response.data.token,
          tokenType: 'Bearer'
        }
        localStorage.setItem('authToken', response.data.token)
      }

      // Store user if provided
      if (response.data.user) {
        user.value = response.data.user
        localStorage.setItem('authUser', JSON.stringify(response.data.user))
      }

      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Signup failed. Please try again.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    signUp,
    loading: computed(() => loading.value),
    error: computed(() => error.value)
  }
}

// Sign in
export const useSignIn = () => {
  const router = useRouter()
  
  const signIn = async (credentials: Credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('https://yourapi.com/login', credentials)
      
      // Store token
      if (response.data.token) {
        token.value = {
          accessToken: response.data.token,
          tokenType: 'Bearer'
        }
        localStorage.setItem('authToken', response.data.token)
      }

      // Store user
      if (response.data.user) {
        user.value = response.data.user
        localStorage.setItem('authUser', JSON.stringify(response.data.user))
      }

      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Invalid email or password.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    signIn,
    loading: computed(() => loading.value),
    error: computed(() => error.value)
  }
}

// Sign out
export const useSignOut = () => {
  const router = useRouter()
  
  const signOut = async () => {
    loading.value = true
    
    try {
      // Call logout endpoint if needed
      if (token.value?.accessToken) {
        await axios.post('https://yourapi.com/logout', {}, {
          headers: {
            Authorization: `Bearer ${token.value.accessToken}`
          }
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearAuth()
      loading.value = false
      router.push('/login')
    }
  }

  return {
    signOut,
    loading: computed(() => loading.value)
  }
}

// Get current auth state
export const useAuth = () => {
  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadAuthFromStorage,
    clearAuth
  }
}

// Initialize auth on module load
if (typeof window !== 'undefined') {
  loadAuthFromStorage()
}

