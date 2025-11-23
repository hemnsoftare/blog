<template>
  <div class="signin-container">
    <h2 class="title">Sign In</h2>

    <form @submit.prevent="onSubmit" class="form">
      <!-- Email -->
      <div class="field">
        <label for="email">Email of user</label>
        <input
          id="email of person"
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <!-- Password -->
      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          required
          minlength="6"
        />
      </div>

      <!-- Error message -->
      <p v-if="error" class="error  ">
        {{ error }}
      </p>

      <!-- Actions -->
      <button type="submit" class="btn" :disabled="loading">
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign In</span>
      </button>
    </form>

    <p v-if="showRegisterLink" class="bottom-text">
      Don't have an account?
      <a href="#" @click.prevent="$emit('go-register')">Sign up</a>
    </p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

// props
const props = defineProps({
  showRegisterLink: {
    type: Boolean,
    default: true
  }
})

// emits
const emit = defineEmits(['submit', 'go-register'])

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const onSubmit = async () => {
  error.value = ''

  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields.'
    return
  }

  try {
    loading.value = true

    // Emit to parent so it can call API
    // Parent will receive: { email, password }
    emit('submit', { ...form })

    // If you want to reset fields after submit:
    // form.email = ''
    // form.password = ''
  } catch (e) {
    error.value = 'Sign in failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signin-container {
  max-width: 360px;
  margin: 40px auto;
  padding: 24px 20px;
  border-radius: 12px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  background: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
}

input {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  outline: none;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.error {
  color: #dc2626;
  font-size: 0.85rem;
}

.btn {
  margin-top: 8px;
  padding: 10px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: #3b82f6;
  color: white;
  font-size: 0.95rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.bottom-text {
  margin-top: 16px;
  text-align: center;
  font-size: 0.9rem;
}

.bottom-text a {
  color: #3b82f6;
  text-decoration: none;
}

.bottom-text a:hover {
  text-decoration: underline;
}
</style>
