<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="logo">
          <h1 class="text-gray-800 text-xl font-bold">My Blog</h1>
        </div>

        <!-- Center: Search -->
        <SearchBar @search="onSearch" />

        <!-- Right: Links + Profile -->
        <div class="flex items-center space-x-6">
          <NavLinks />

          <!-- Auth section -->
          <ProfileDropdown v-if="user" :user="user" />
          <SignInButton v-else>Sign In</SignInButton>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { useUser, SignInButton } from '@clerk/vue'
import SearchBar from './SearchBar.vue'
import NavLinks from './NavLinks.vue'
import ProfileDropdown from './ProfileDropdown.vue'

const { user } = useUser()

const onSearch = (query: string) => {
  console.log('Search query:', query)
  // Later, you can emit this to filter blog posts or trigger router navigation
}
</script>