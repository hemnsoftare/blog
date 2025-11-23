<template>
  <div
    class="plan-card bg-white rounded-xl border border-gray-100 shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition-shadow"
    @click="emit('select', plan.id)"
  >
  <div class="flex flex-1 items-center justify-start flex-col">
    <h2 class="text-2xl font-semibold text-gray-800 mb-3">{{ plan.name }}</h2>

    <p class="text-5xl font-bold text-blue-600 mb-4">
      {{ plan.price }}
      <span class="text-lg text-gray-500 font-normal">/month</span>
    </p>

    <ul class="w-full text-gray-700 mb-6">
      <li
        v-for="feature in plan.features"
        :key="feature"
        class="flex items-center gap-2 py-1"
      >
        ✔️ {{ feature }}
      </li>
    </ul>
</div>
    <button
      class="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      Get Started
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Plan, PlanEmit } from '../type';

const props = defineProps<{ plan: Plan }>();
const emit = defineEmits<PlanEmit>();
</script>

<style scoped>
.plan-card:hover {
  transform: scale(1.03);
  transition: transform 0.3s ease;
}
</style>


