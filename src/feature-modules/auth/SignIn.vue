<template>
  <AuthCard
    title="Welcome Back"
    subtitle="Sign in to your account"
  >
    <form @submit.prevent="handleSignIn">
      <FormInput
        v-model="formData.email"
        label="Email"
        type="email"
        placeholder="your@email.com"
        :error="errors.email"
        :required="true"
      />

      <FormInput
        v-model="formData.password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        :error="errors.password"
        :required="true"
      />

      <div class="form-options">
        <label class="remember-me">
          <input
            v-model="formData.remember"
            type="checkbox"
          />
          <span>Remember me</span>
        </label>
        <router-link to="/forgot-password" class="forgot-link">
          Forgot password?
        </router-link>
      </div>

      <ErrorMessage
        v-if="generalError"
        :message="generalError"
        variant="error"
        :dismissible="true"
        @dismiss="generalError = ''"
      />

      <FormButton
        type="submit"
        variant="primary"
        :loading="loading"
        full-width
        size="lg"
      >
        Sign In
      </FormButton>

      <SocialAuth
        :loading="loading"
        @social-login="handleSocialLogin"
      />
    </form>

    <template #footer>
      <p>
        Don't have an account?
        <router-link to="/signup" class="auth-link">Sign Up</router-link>
      </p>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  AuthCard,
  FormInput,
  FormButton,
  ErrorMessage,
  SocialAuth
} from './component'

const router = useRouter()

const formData = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const generalError = ref('')
const loading = ref(false)

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.email = ''
  errors.password = ''
  generalError.value = ''

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleSignIn = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  generalError.value = ''

  try {
    const response = await axios.post('https://yourapi.com/login', {
      email: formData.email.trim(),
      password: formData.password,
      remember: formData.remember
    })

    console.log('Sign in successful:', response.data)

    // Store token if provided
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token)
    }

    // Redirect to home or dashboard
    router.push('/')

  } catch (err: any) {
    generalError.value = err.response?.data?.message || 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = (provider: string) => {
  console.log(`Social login with ${provider}`)
  // Implement social login logic here
  // This would typically redirect to OAuth provider
}
</script>

<style scoped>
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #374151;
}

.remember-me input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: #10b981;
}

.forgot-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #059669;
  text-decoration: underline;
}

.auth-link {
  color: #10b981;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #059669;
  text-decoration: underline;
}
</style>
