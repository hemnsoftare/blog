<template>
  <div :class="['loading-spinner', size, { 'overlay': overlay }]">
    <div class="spinner-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  overlay?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  overlay: false
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-spinner.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.spinner-ring {
  display: inline-block;
  position: relative;
}

.spinner-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  border: 3px solid #10b981;
  border-radius: 50%;
  animation: spinner-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #10b981 transparent transparent transparent;
}

.spinner-ring.sm div {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.spinner-ring.md div {
  width: 2.5rem;
  height: 2.5rem;
  border-width: 3px;
}

.spinner-ring.lg div {
  width: 4rem;
  height: 4rem;
  border-width: 4px;
}

.spinner-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes spinner-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-message {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

/* Size classes for spinner-ring */
.sm .spinner-ring div {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.md .spinner-ring div {
  width: 2.5rem;
  height: 2.5rem;
  border-width: 3px;
}

.lg .spinner-ring div {
  width: 4rem;
  height: 4rem;
  border-width: 4px;
}
</style>


