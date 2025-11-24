<template>
  <nav aria-label="Main Navigation">
    <ul class="flex items-center gap-6">
      <li v-for="link in links" :key="link.to">
        <RouterLink
          :to="link.to"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="navigate"
            :class="[
              'transition-colors duration-300 text-sm font-medium',
              isActive
                ? 'text-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            ]"
          >
            {{ link.name }}
          </a>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { type RouteLocationRaw } from 'vue-router'

interface NavLink {
  name: string
  to: RouteLocationRaw
}

const links: NavLink[] = [
  { name: 'Home', to: '/' },
  { name: 'Blog', to: '/blog' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
  { name: 'Pricing', to: '/price' }
]
</script>