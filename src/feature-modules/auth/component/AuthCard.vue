<template>
  <div class="auth-card-container">
    <div :class="['auth-card', { 'compact': compact }]">
      <div v-if="showLogo" class="auth-logo">
        <slot name="logo">
          <div class="default-logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>
        </slot>
      </div>

      <div class="auth-header">
        <h2 class="auth-title">{{ title }}</h2>
        <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
      </div>

      <div class="auth-content">
        <slot />
      </div>

      <div v-if="$slots.footer" class="auth-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  showLogo?: boolean
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  showLogo: true,
  compact: false
})
</script>

<style scoped>
.auth-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.auth-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.auth-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.auth-card.compact {
  max-width: 400px;
  padding: 2rem;
}

.auth-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.default-logo {
  width: 3rem;
  height: 3rem;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-logo svg {
  width: 100%;
  height: 100%;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.auth-content {
  margin-bottom: 1.5rem;
}

.auth-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }
}
</style>

