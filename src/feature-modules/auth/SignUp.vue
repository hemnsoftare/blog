<template>
  <div class="signup-container">
    <form class="signup-card" @submit.prevent="handleSignup">
      <h2>Create Account</h2>

      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />

      <p v-if="error" class="error">{{ error }}</p>

      <button :disabled="loading">
        {{ loading ? "Creating your account..." : "Sign Up" }}
      </button>

      <p class="login-link">
        Already have an account?
        <router-link to="/login">Sign In</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()

const username = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const error = ref("")
const loading = ref(false)

const handleSignup = async () => {
  error.value = ""

  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match"
    return
  }

  if (password.value.length < 6) {
    error.value = "Password must be at least 6 characters"
    return
  }

  loading.value = true

  try {
    const response = await axios.post("https://yourapi.com/signup", {
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value
    })

    console.log("Signup successful:", response.data)

    // Redirect to login page
    router.push("/login")

  } catch (err) {
    error.value = err.response?.data?.message || "Signup failed. Try again."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f8fafc;
}

.signup-card {
  background: white;
  padding: 25px;
  width: 350px;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.signup-card h2 {
  text-align: center;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  margin-bottom: 10px;
  outline: none;
}

input:focus {
  border-color: #10b981;
}

button {
  width: 100%;
  padding: 10px;
  background: #10b981;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

button:hover {
  background: #059669;
}

button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  margin-bottom: 10px;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 10px;
}
</style>
