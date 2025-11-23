<template>
  <form class="sign-in" @submit.prevent="onSubmit">
    <h2>Sign In</h2>

    <label>
      Email
      <input v-model="email" type="email" required />
    </label>

    <label>
      Password
      <input v-model="password" type="password" required />
    </label>

    <button type="submit">Sign In</button>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')

const onSubmit = () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please fill all fields'
    return
  }

  // fake login
  console.log('Sign in with:', email.value, password.value)
  alert(`Signed in as ${email.value}`)
}
</script>

<style scoped>
.sign-in {
  max-width: 300px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
}
button {
  padding: 8px;
  cursor: pointer;
}
.error {
  color: red;
  font-size: 0.9rem;
}
</style>
