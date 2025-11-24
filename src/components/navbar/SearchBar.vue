<template>
  <div class="relative w-1/2">
    <input
      v-model="searchQuery"
      @input="emitSearch"
      type="text"
      placeholder="Search posts..."
      class="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5 absolute left-3 top-2.5 text-gray-500"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const emit = defineEmits<{ (e: 'search', query: string): void }>()

const emitSearch = () => {
  emit('search', searchQuery.value)
}
</script>