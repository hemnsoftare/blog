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