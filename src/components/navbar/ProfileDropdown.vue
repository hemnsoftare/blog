<template>
  <li class="relative">
    <div @click="toggleDropdown" class="cursor-pointer">
      <img
        :src="user.imageUrl || 'https://via.placeholder.com/40'"
        alt="User"
        class="w-10 h-10 rounded-full border border-gray-200"
      />
    </div>

    <ul
      v-show="isDropdownOpen"
      class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50"
    >
      <li>
        <router-link
          to="/my-posts"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          @click="isDropdownOpen = false"
        >
          My Posts
        </router-link>
      </li>
      <li>
        <router-link
          to="/my-favorites"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          @click="isDropdownOpen = false"
        >
          My Favorites
        </router-link>
      </li>
      <li>
        <router-link
          to="/create-post"
          class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          @click="isDropdownOpen = false"
        >
          Create Post
        </router-link>
      </li>
      <li>
        <button
          class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          @click="signOutUser"
        >
          Logout
        </button>
      </li>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClerk } from '@clerk/vue'

const props = defineProps<{ user: any }>()
console.log(props)
const isDropdownOpen = ref(false)
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value)

const clerk = useClerk()
const signOutUser = () => {
  clerk.value?.signOut()
  isDropdownOpen.value = false
}
</script>