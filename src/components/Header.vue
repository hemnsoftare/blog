<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="logo">
          <h1 class="text-gray-800 text-xl font-bold">My Blog</h1>
        </div>

        <!-- Navigation Links -->
        <ul class="flex items-center space-x-6">
          <li>
            <router-link 
              to="/" 
              class="text-gray-600 hover:text-blue-500 transition-colors duration-300"
              active-class="text-blue-500 font-medium"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link 
              to="/blog" 
              class="text-gray-600 hover:text-blue-500 transition-colors duration-300"
              active-class="text-blue-500 font-medium"
            >
              Blog
            </router-link>
          </li>
          <li>
            <router-link 
              to="/about" 
              class="text-gray-600 hover:text-blue-500 transition-colors duration-300"
              active-class="text-blue-500 font-medium"
            >
              About
            </router-link>
          </li>
          <li>
            <router-link 
              to="/contact" 
              class="text-gray-600 hover:text-blue-500 transition-colors duration-300"
              active-class="text-blue-500 font-medium"
            >
              Contact
            </router-link>
          </li>

          <!-- Profile Dropdown -->
          <li class="relative" v-if="user">
            <div @click="toggleDropdown" class="cursor-pointer">
              <img 
                :src="profileImageUrl" 
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

          <!-- Signed-out button -->
          <li v-else>
            <SignInButton>Sign In</SignInButton>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useUser, SignInButton, useClerk } from '@clerk/vue';

// User info
const { user } = useUser();
const profileImageUrl = user.value?.imageUrl || 'https://via.placeholder.com/40';

// Dropdown state
const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// Clerk instance
const clerk = useClerk();

// Sign out function with type safety
const signOutUser = () => {
  if (clerk.value) {
    clerk.value.signOut();
  }
  isDropdownOpen.value = false;
}
</script>