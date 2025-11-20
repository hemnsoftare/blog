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