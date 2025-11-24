# Auth Components

Reusable components for authentication features.

## Components

### FormInput
A styled input component with validation, error messages, and icons.

**Props:**
- `modelValue` (string | number) - The input value
- `label` (string, optional) - Input label
- `type` (string, default: 'text') - Input type
- `placeholder` (string, optional) - Placeholder text
- `error` (string, optional) - Error message to display
- `hint` (string, optional) - Helper text
- `required` (boolean, default: false) - Show required indicator
- `disabled` (boolean, default: false) - Disable input

**Events:**
- `update:modelValue` - Emitted when value changes
- `blur` - Emitted on blur
- `focus` - Emitted on focus

**Slots:**
- `icon` - Icon to display inside input

**Example:**
```vue
<FormInput
  v-model="email"
  label="Email"
  type="email"
  placeholder="Enter your email"
  :error="errors.email"
/>
```

---

### FormButton
A customizable button component with loading states and variants.

**Props:**
- `type` ('button' | 'submit' | 'reset', default: 'button')
- `variant` ('primary' | 'secondary' | 'outline' | 'danger', default: 'primary')
- `size` ('sm' | 'md' | 'lg', default: 'md')
- `disabled` (boolean, default: false)
- `loading` (boolean, default: false)
- `fullWidth` (boolean, default: false)
- `label` (string, optional)

**Events:**
- `click` - Emitted on click

**Slots:**
- `default` - Button text
- `icon` - Icon to display

**Example:**
```vue
<FormButton
  type="submit"
  variant="primary"
  :loading="isSubmitting"
  full-width
>
  Sign In
</FormButton>
```

---

### ErrorMessage
Displays error, warning, or info messages with dismiss functionality.

**Props:**
- `message` (string, optional) - Error message
- `title` (string, optional) - Error title
- `variant` ('error' | 'warning' | 'info', default: 'error')
- `dismissible` (boolean, default: false)

**Events:**
- `dismiss` - Emitted when dismissed

**Example:**
```vue
<ErrorMessage
  message="Invalid email or password"
  title="Login Failed"
  variant="error"
  :dismissible="true"
  @dismiss="clearError"
/>
```

---

### PasswordStrength
Visual password strength indicator with requirements checklist.

**Props:**
- `password` (string) - Password to analyze
- `showRequirements` (boolean, default: true) - Show requirements list
- `minLength` (number, default: 6) - Minimum password length

**Example:**
```vue
<PasswordStrength
  :password="password"
  :show-requirements="true"
  :min-length="8"
/>
```

---

### SocialAuth
Social authentication buttons (Google, GitHub, Facebook, etc.)

**Props:**
- `providers` (array, optional) - Array of provider objects
- `showDivider` (boolean, default: true) - Show divider text
- `dividerText` (string, default: 'Or continue with')
- `loading` (boolean, default: false)

**Events:**
- `socialLogin` - Emitted with provider name

**Example:**
```vue
<SocialAuth
  :providers="[
    { name: 'google', label: 'Continue with Google' },
    { name: 'github', label: 'Continue with GitHub' }
  ]"
  @social-login="handleSocialLogin"
/>
```

---

### AuthCard
Container card for authentication forms with logo and header.

**Props:**
- `title` (string) - Card title
- `subtitle` (string, optional) - Card subtitle
- `showLogo` (boolean, default: true) - Show logo
- `compact` (boolean, default: false) - Compact mode

**Slots:**
- `default` - Main content
- `logo` - Custom logo
- `footer` - Footer content

**Example:**
```vue
<AuthCard
  title="Welcome Back"
  subtitle="Sign in to your account"
>
  <form>
    <!-- Form content -->
  </form>
  
  <template #footer>
    <p>Don't have an account? <router-link to="/signup">Sign up</router-link></p>
  </template>
</AuthCard>
```

---

### LoadingSpinner
Loading spinner with customizable size and overlay mode.

**Props:**
- `size` ('sm' | 'md' | 'lg', default: 'md')
- `message` (string, optional) - Loading message
- `overlay` (boolean, default: false) - Full screen overlay

**Example:**
```vue
<LoadingSpinner
  size="lg"
  message="Loading..."
  :overlay="true"
/>
```

---

## Usage Example

Complete sign-up form example:

```vue
<template>
  <AuthCard
    title="Create Account"
    subtitle="Join us today"
  >
    <form @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.username"
        label="Username"
        placeholder="Choose a username"
        :error="errors.username"
        required
      />

      <FormInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="your@email.com"
        :error="errors.email"
        required
      />

      <FormInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Create a password"
        :error="errors.password"
        required
      >
        <template #icon>
          <LockIcon />
        </template>
      </FormInput>

      <PasswordStrength
        :password="form.password"
        :min-length="8"
      />

      <ErrorMessage
        v-if="generalError"
        :message="generalError"
        variant="error"
      />

      <FormButton
        type="submit"
        variant="primary"
        :loading="isSubmitting"
        full-width
      >
        Sign Up
      </FormButton>

      <SocialAuth
        @social-login="handleSocialLogin"
      />
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  AuthCard,
  FormInput,
  FormButton,
  PasswordStrength,
  ErrorMessage,
  SocialAuth
} from './component'

// Component logic...
</script>
```

