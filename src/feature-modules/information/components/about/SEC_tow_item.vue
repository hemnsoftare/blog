<template>
  <div :class="['flex items-center gap-6', reverse ? 'flex-row-reverse' : '']">
    
    <!-- Text -->
    <div class="w-1/2">
      <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
      <p class="text-gray-600 w-1/2">{{ text }}</p>
    </div>

    <!-- Image -->
    <div class="w-1/2">
      <img
        v-if="image"
        :src="image"
        :alt="title"
        class="w-full h-44 object-cover rounded-xl shadow"
      />

      <div
        v-else
        class="w-full h-32 bg-blue-100 rounded-xl"
      ></div>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  text: string
  reverse: boolean
  image?: string
}>()
</script>
