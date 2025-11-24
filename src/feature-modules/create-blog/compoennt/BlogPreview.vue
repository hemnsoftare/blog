<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  image?: string | null
  author: string
  date: string
}>()

// Fallback values without computed
const displayTitle = props.title || "Untitled Blog Post"
const displayDescription = props.description || "No description provided..."
const authorInitial = props.author.charAt(0).toUpperCase()
const readTime = Math.ceil((props.description?.length || 0) / 200)
</script>

<template>
  <article class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

    <!-- Cover Image -->
    <div class="relative">
      <img
        v-if="image"
        :src="image"
        :alt="displayTitle"
        class="w-full h-80 object-cover"
      />

      <div
        v-else
        class="w-full h-80 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Preview Badge -->
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-medium rounded-full">
          Preview Mode
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 md:p-8">

      <!-- Meta Info -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {{ authorInitial }}
        </div>

        <div>
          <p class="font-semibold text-gray-800">{{ author }}</p>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ date }}</span>
          </div>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {{ displayTitle }}
      </h1>

      <!-- Divider -->
      <div class="w-20 h-1 bg-blue-500 rounded-full mb-6"></div>

      <!-- Description -->
      <div class="prose prose-lg max-w-none">
        <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {{ displayDescription }}
        </p>
      </div>

      <!-- Footer Stats -->
      <div class="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100">
        <div class="flex items-center gap-2 text-gray-500">
          ❤️ <span class="text-sm">0 likes</span>
        </div>

        <div class="flex items-center gap-2 text-gray-500">
          💬 <span class="text-sm">0 comments</span>
        </div>

        <div class="flex items-center gap-2 text-gray-500">
          👁 <span class="text-sm">{{ readTime }} min read</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped></style>
