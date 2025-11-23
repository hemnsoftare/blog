<template>
  <li ref="dropdownRef" class="relative">
    <!-- Avatar Button -->
    <button
      @click="toggleDropdown"
      type="button"
      class="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      aria-haspopup="true"
      :aria-expanded="isDropdownOpen"
    >
      <img
        :src="user.imageUrl || fallbackImage"
        alt="User avatar"
        class="w-10 h-10 rounded-full border border-gray-200"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition name="fade">
      <ul
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50"
        role="menu"
      >
        <li v-for="item in menuItems" :key="item.label">
          <RouterLink
            v-if="item.type === 'link'"
            :to="item.to"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            role="menuitem"
            @click="closeDropdown"
          >
            {{ item.label }}
          </RouterLink>

          <button
            v-else
            class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            role="menuitem"
            @click="handleAction"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useClerk } from '@clerk/vue'

interface User {
  imageUrl?: string | null
}

const props = defineProps<{ user: User }>()

const fallbackImage = 'https://via.placeholder.com/40'
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const clerk = useClerk()

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleAction = async () => {
  await clerk.value?.signOut()
  closeDropdown()
}

const menuItems = [
  { label: 'My Posts', type: 'link', to: '/my-posts' },
  { label: 'My Favorites', type: 'link', to: '/my-favorites' },
  { label: 'Create Post', type: 'link', to: '/create-post' },
  { label: 'Logout', type: 'button' }
]

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>