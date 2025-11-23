<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  image: string | null;
  author: string;
  date: string;
}>();
</script>

<template>
  <article class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Cover Image -->
    <div class="relative">
      <img
        v-if="image"
        :src="image"
        :alt="title"
        class="w-full h-80 object-cover"
      />
      <div
        v-else
        class="w-full h-80 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
        <!-- Author Avatar -->
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {{ author.charAt(0).toUpperCase() }}
        </div>
        
        <div>
          <p class="font-semibold text-gray-800">{{ author }}</p>
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ date }}</span>
          </div>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {{ title || "Untitled Blog Post" }}
      </h1>

      <!-- Divider -->
      <div class="w-20 h-1 bg-blue-500 rounded-full mb-6"></div>

      <!-- Description -->
      <div class="prose prose-lg max-w-none">
        <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {{ description || "No description provided..." }}
        </p>
      </div>

      <!-- Footer Stats (placeholder) -->
      <div class="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100">
        <div class="flex items-center gap-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="text-sm">0 likes</span>
        </div>
        
        <div class="flex items-center gap-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="text-sm">0 comments</span>
        </div>
        
        <div class="flex items-center gap-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="text-sm">{{ Math.ceil(description.length / 200) }} min read</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped></style>