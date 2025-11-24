<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  image?: string | null
  author: string
  date: string
}>()

const displayTitle = props.title || "Untitled Blog Post"
const displayDescription = props.description || "No description provided..."
const authorInitial = props.author.charAt(0).toUpperCase()
const readTime = Math.ceil((props.description?.length || 0) / 200)
</script>

<template>
  <transition name="fade-slide" appear>
    <article
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card"
    >

      <!-- Cover Image -->
      <div class="relative image-wrapper">
        <img
          v-if="image"
          :src="image"
          :alt="displayTitle"
          class="w-full h-80 object-cover image"
        />

        <div
          v-else
          class="w-full h-80 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
        >
          <span class="text-white/60 text-xl font-bold">No Image</span>
        </div>

        <!-- Preview Badge -->
        <div class="absolute top-4 left-4">
          <span class="px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-medium rounded-full shadow-md">
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
            <p class="text-sm text-gray-500">{{ date }}</p>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {{ displayTitle }}
        </h1>

        <!-- Divider -->
        <div class="w-20 h-1 bg-blue-500 rounded-full mb-6"></div>

        <!-- Description -->
        <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {{ displayDescription }}
        </p>

        <!-- Footer Stats -->
        <div class="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100 text-gray-500">
          <span>❤️ 0 likes</span>
          <span>💬 0 comments</span>
          <span>👁 {{ readTime }} min read</span>
        </div>
      </div>

    </article>
  </transition>
</template>

<style scoped>
/* Fade + Slide In Animation */
.fade-slide-enter-active {
  transition: all 0.6s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Card Hover Animation */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
}

/* Image Hover Animation */
.image-wrapper {
  overflow: hidden;
}

.image {
  transition: transform 0.4s ease;
}

.image-wrapper:hover .image {
  transform: scale(1.05);
}
</style>
