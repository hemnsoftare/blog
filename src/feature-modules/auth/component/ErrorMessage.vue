<template>
  <Transition name="fade">
    <div v-if="message" :class="['error-message-container', variant]">
      <svg class="error-icon" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
      <div class="error-content">
        <p class="error-title">{{ title || 'Error' }}</p>
        <p class="error-text">{{ message }}</p>
      </div>
      <button v-if="dismissible" @click="$emit('dismiss')" class="dismiss-button" aria-label="Dismiss">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  title?: string
  variant?: 'error' | 'warning' | 'info'
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'error',
  dismissible: false
})

defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.error-message-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  position: relative;
}

.error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.warning {
  background-color: #fffbeb;
  border: 1px solid #fed7aa;
  color: #92400e;
}

.info {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.error-content {
  flex: 1;
}

.error-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.error-text {
  font-size: 0.875rem;
  line-height: 1.5;
}

.dismiss-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.dismiss-button:hover {
  opacity: 1;
}

.dismiss-button svg {
  width: 1rem;
  height: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>


