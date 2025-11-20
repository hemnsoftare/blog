<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const emit = defineEmits<{ (e: 'search', query: string): void }>()

const emitSearch = () => {
  emit('search', searchQuery.value)
}
</script>