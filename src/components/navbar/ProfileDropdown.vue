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