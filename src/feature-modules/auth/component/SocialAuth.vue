<template>
  <div class="social-auth">
    <div v-if="showDivider" class="divider">
      <span class="divider-text">{{ dividerText }}</span>
    </div>

    <div class="social-buttons">
      <button
        v-for="provider in providers"
        :key="provider.name"
        :class="['social-button', provider.name]"
        @click="handleSocialLogin(provider.name)"
        :disabled="loading"
      >
        <svg v-if="provider.icon" class="social-icon" viewBox="0 0 24 24" fill="currentColor">
          <component :is="provider.icon" />
        </svg>
        <span class="social-text">{{ provider.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SocialProvider {
  name: string
  label: string
  icon?: string
}

interface Props {
  providers?: SocialProvider[]
  showDivider?: boolean
  dividerText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  providers: () => [
    { name: 'google', label: 'Continue with Google' },
    { name: 'github', label: 'Continue with GitHub' },
    { name: 'facebook', label: 'Continue with Facebook' }
  ],
  showDivider: true,
  dividerText: 'Or continue with',
  loading: false
})

const emit = defineEmits<{
  socialLogin: [provider: string]
}>()

const handleSocialLogin = (provider: string) => {
  if (!props.loading) {
    emit('socialLogin', provider)
  }
}
</script>

<style scoped>
.social-auth {
  width: 100%;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  text-align: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider-text {
  padding: 0 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-button:hover:not(:disabled) {
  border-color: #d1d5db;
  background: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-button:active:not(:disabled) {
  transform: translateY(0);
}

.social-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.social-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.social-text {
  flex: 1;
  text-align: center;
}

/* Provider-specific styles */
.social-button.google {
  border-color: #e5e7eb;
}

.social-button.google:hover:not(:disabled) {
  border-color: #db4437;
  background: #fef2f2;
}

.social-button.github {
  border-color: #e5e7eb;
}

.social-button.github:hover:not(:disabled) {
  border-color: #24292e;
  background: #f6f8fa;
}

.social-button.facebook {
  border-color: #e5e7eb;
}

.social-button.facebook:hover:not(:disabled) {
  border-color: #1877f2;
  background: #eff6ff;
}
</style>


