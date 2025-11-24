<template>
  <div class="password-strength">
    <div class="strength-bars">
      <div
        v-for="(bar, index) in bars"
        :key="index"
        :class="['strength-bar', bar.class]"
      ></div>
    </div>
    <p :class="['strength-text', strengthClass]">
      {{ strengthText }}
    </p>
    <ul v-if="showRequirements" class="requirements-list">
      <li
        v-for="(req, index) in requirements"
        :key="index"
        :class="{ 'met': req.met }"
      >
        <svg
          v-if="req.met"
          class="check-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          class="x-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
        {{ req.text }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  password: string
  showRequirements?: boolean
  minLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  showRequirements: true,
  minLength: 6
})

const strength = computed(() => {
  const pwd = props.password
  if (!pwd) return 0

  let score = 0

  // Length check
  if (pwd.length >= props.minLength) score++
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++

  // Character variety checks
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^a-zA-Z0-9]/.test(pwd)) score++

  return Math.min(score, 4)
})

const strengthText = computed(() => {
  const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return levels[strength.value] || 'Very Weak'
})

const strengthClass = computed(() => {
  const classes = ['very-weak', 'weak', 'fair', 'good', 'strong']
  return classes[strength.value] || 'very-weak'
})

const bars = computed(() => {
  const count = strength.value
  return Array.from({ length: 4 }, (_, i) => ({
    class: i < count ? strengthClass.value : 'empty'
  }))
})

const requirements = computed(() => {
  const pwd = props.password
  return [
    {
      text: `At least ${props.minLength} characters`,
      met: pwd.length >= props.minLength
    },
    {
      text: 'Contains lowercase letter',
      met: /[a-z]/.test(pwd)
    },
    {
      text: 'Contains uppercase letter',
      met: /[A-Z]/.test(pwd)
    },
    {
      text: 'Contains number',
      met: /[0-9]/.test(pwd)
    },
    {
      text: 'Contains special character',
      met: /[^a-zA-Z0-9]/.test(pwd)
    }
  ]
})
</script>

<style scoped>
.password-strength {
  margin-top: 0.5rem;
}

.strength-bars {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.strength-bar {
  height: 4px;
  flex: 1;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-bar.empty {
  background-color: #e5e7eb;
}

.strength-bar.very-weak {
  background-color: #ef4444;
}

.strength-bar.weak {
  background-color: #f59e0b;
}

.strength-bar.fair {
  background-color: #eab308;
}

.strength-bar.good {
  background-color: #3b82f6;
}

.strength-bar.strong {
  background-color: #10b981;
}

.strength-text {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.strength-text.very-weak {
  color: #ef4444;
}

.strength-text.weak {
  color: #f59e0b;
}

.strength-text.fair {
  color: #eab308;
}

.strength-text.good {
  color: #3b82f6;
}

.strength-text.strong {
  color: #10b981;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  transition: color 0.2s;
}

.requirements-list li.met {
  color: #10b981;
}

.check-icon,
.x-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.check-icon {
  color: #10b981;
}

.x-icon {
  color: #9ca3af;
}
</style>


