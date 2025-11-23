<!-- src/components/navbar/NavLinks.vue -->
<template>
  <ul class="flex items-center space-x-6">
    <li v-for="link in links" :key="link.to">
      <router-link
        :to="link.to"
        class="text-gray-600 hover:text-blue-500 transition-colors duration-300"
        active-class="text-blue-500 font-medium"
      >
        {{ link.name }}
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
const links = [
  { name: 'Home', to: '/' },
  { name: 'Blog', to: '/blog' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
  { name: 'Pricing', to: '/price' }
]
</script>
