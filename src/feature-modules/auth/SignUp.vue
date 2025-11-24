<template>
  <AuthCard
    title="Create Account"
    subtitle="Join us and start your journey"
  >
    <form @submit.prevent="handleSignup">
      <FormInput
        v-model="formData.username"
        label="Username"
        type="text"
        placeholder="Choose a username"
        :error="errors.username"
        :required="true"
      />

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
        placeholder="Create a secure password"
        :error="errors.password"
        :required="true"
      />

      <PasswordStrength
        v-if="formData.password"
        :password="formData.password"
        :min-length="6"
      />

      <FormInput
        v-model="formData.confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        :error="errors.confirmPassword"
        :required="true"
      />

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
        Create Account
      </FormButton>

      <SocialAuth
        :loading="loading"
        @social-login="handleSocialLogin"
      />
    </form>

    <template #footer>
      <p>
        Already have an account?
        <router-link to="/login" class="auth-link">Sign In</router-link>
      </p>
    </template>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import {
  AuthCard,
  FormInput,
  FormButton,
  PasswordStrength,
  ErrorMessage,
  SocialAuth
} from "./component"

const router = useRouter()

const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
})

const errors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
})

const generalError = ref("")
const loading = ref(false)

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ""
  })
  generalError.value = ""

  // Username validation
  if (!formData.username.trim()) {
    errors.username = "Username is required"
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = "Username must be at least 3 characters"
    isValid = false
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email is required"
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address"
    isValid = false
  }

  // Password validation
  if (!formData.password) {
    errors.password = "Password is required"
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters"
    isValid = false
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password"
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match"
    isValid = false
  }

  return isValid
}

const handleSignup = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  generalError.value = ""

  try {
    const response = await axios.post("https://yourapi.com/signup", {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password
    })

    console.log("Signup successful:", response.data)

    // Redirect to login page
    router.push("/login")

  } catch (err: any) {
    generalError.value = err.response?.data?.message || "Signup failed. Please try again."
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
