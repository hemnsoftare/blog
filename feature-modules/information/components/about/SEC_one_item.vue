<template>
  <div class="bg-blue-50 p-6 rounded-xl shadow">
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; text: string }>()
</script>
