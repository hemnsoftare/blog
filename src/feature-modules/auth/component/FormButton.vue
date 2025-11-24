<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['form-button', variant, size, { 'full-width': fullWidth }]"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-if="!loading" name="icon" />
    <span class="button-text">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.form-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
  position: relative;
}

.form-button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
}

.form-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-button.full-width {
  width: 100%;
}

/* Sizes */
.sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Variants */
.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.secondary {
  background: #6b7280;
  color: white;
}

.secondary:hover:not(:disabled) {
  background: #4b5563;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.outline {
  background: transparent;
  color: #10b981;
  border: 2px solid #10b981;
}

.outline:hover:not(:disabled) {
  background: #10b981;
  color: white;
  transform: translateY(-1px);
}

.danger {
  background: #ef4444;
  color: white;
}

.danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.button-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

