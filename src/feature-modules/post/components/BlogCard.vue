<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from 'vue';
import { ThumbsUp, ThumbsDown } from 'lucide-vue-next'
import type { BlogPost } from '../../../types/database';
import gsap from 'gsap';

const props = defineProps<{
  post: BlogPost;
}>();

// Like and dislike counters
const likes = ref(Math.floor(Math.random() * 100));
const dislikes = ref(Math.floor(Math.random() * 50));
const userLiked = ref(false);
const userDisliked = ref(false);

// Refs for animation
const cardRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

// Shorten content to approx 2 lines (~100 chars)
const shortContent = computed(() => {
  if (props.post.content.length > 100) {
    return props.post.content.slice(0, 100) + '...';
  }
  return props.post.content;
});

const handleLike = () => {
  if (!userLiked.value) {
    likes.value++;
    userLiked.value = true;
    if (userDisliked.value) {
      dislikes.value--;
      userDisliked.value = false;
    }
    // Pulse animation
    gsap.to('.like-btn', { scale: 1.3, duration: 0.1, yoyo: true, repeat: 1 });
  }
};

const handleDislike = () => {
  if (!userDisliked.value) {
    dislikes.value++;
    userDisliked.value = true;
    if (userLiked.value) {
      likes.value--;
      userLiked.value = false;
    }
    // Pulse animation
    gsap.to('.dislike-btn', { scale: 1.3, duration: 0.1, yoyo: true, repeat: 1 });
  }
};

onMounted(() => {
  // Initial entrance animation
  gsap.from(cardRef.value, {
    opacity: 0,
    y: 50,
    duration: 0.6,
    ease: 'power3.out'
  });

  gsap.from(imageRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    delay: 0.2,
    ease: 'back.out(1.7)'
  });

  gsap.from(contentRef.value, {
    opacity: 0,
    y: 20,
    duration: 0.4,
    delay: 0.4,
    ease: 'power2.out'
  });
});

const handleMouseEnter = () => {
  gsap.to(cardRef.value, {
    y: -8,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    duration: 0.3,
    ease: 'power2.out'
  });

  gsap.to(imageRef.value, {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out'
  });
};

const handleMouseLeave = () => {
  gsap.to(cardRef.value, {
    y: 0,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: 'power2.out'
  });

  gsap.to(imageRef.value, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  });
};
</script>
<template>
  <div
    ref="cardRef"
    class="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 cursor-pointer"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Blog Image -->
    <div class="overflow-hidden">
      <img
        ref="imageRef"
        :src="props.post.image"
        alt="Blog Image"
        class="w-full h-56 object-cover"
      />
    </div>

    <!-- Content -->
    <div ref="contentRef" class="p-6 space-y-4">
      <!-- Title -->
      <h2 class="text-xl font-bold text-gray-800 line-clamp-2">
        {{ props.post.title }}
      </h2>

      <!-- Description -->
      <p class="text-gray-600 text-sm leading-relaxed">
        {{ shortContent }}
      </p>

      <!-- Author + Date -->
      <div class="flex items-center justify-between text-sm text-gray-500 mt-4">
        <div class="flex items-center gap-2">
          <img
            :src="props.post.authorImage"
            alt="Author"
            class="w-8 h-8 rounded-full object-cover"
          />
          <span class="font-medium text-gray-700">
            {{ props.post.authorName }}
          </span>
        </div>

        <span>
          {{ props.post.createdAt }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-4">

          <!-- Like -->
          <button
            @click.stop="handleLike"
            class="like-btn flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
            :class="{ 'text-blue-600': userLiked }"
          >
            <ThumbsUp class="w-5 h-5" />
            <span class="text-sm font-medium">{{ likes }}</span>
          </button>

          <!-- Dislike -->
          <button
            @click.stop="handleDislike"
            class="dislike-btn flex items-center gap-1 text-gray-600 hover:text-red-500 transition"
            :class="{ 'text-red-500': userDisliked }"
          >
            <ThumbsDown class="w-5 h-5" />
            <span class="text-sm font-medium">{{ dislikes }}</span>
          </button>
        </div>

        <!-- Read More -->
        <RouterLink
          :to="`/blog/${props.post.id}`"
          class="text-blue-600 text-sm font-medium hover:underline"
        >
          Read More →
        </RouterLink>
      </div>
    </div>
  </div>
</template>
