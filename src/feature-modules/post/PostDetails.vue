<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center p-8 bg-white rounded-2xl shadow-xl">
        <p class="text-red-600 text-xl font-semibold mb-4">Error loading blog post</p>
        <p class="text-gray-600">{{ error.message }}</p>
      </div>
    </div>

    <!-- Blog Content -->
    <div v-else-if="post" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Back Button -->
      <button
        ref="backBtn"
        @click="goBack"
        class="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Back to Blogs</span>
      </button>

      <!-- Hero Image -->
      <div ref="heroImage" class="overflow-hidden rounded-3xl shadow-2xl mb-8">
        <img
          :src="post.image"
          :alt="post.title"
          class="w-full h-64 sm:h-96 lg:h-[500px] object-cover"
        />
      </div>

      <!-- Blog Header -->
      <article class="bg-white rounded-3xl shadow-xl p-6 sm:p-10 mb-8">
        <h1 ref="title" class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {{ post.title }}
        </h1>

        <!-- Author Info -->
        <div ref="authorInfo" class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <img
            :src="post.authorImage"
            :alt="post.authorName"
            class="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-blue-100"
          />
          <div class="flex-1">
            <p class="text-lg font-semibold text-gray-900">{{ post.authorName }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
          </div>
        </div>

        <!-- Likes / Dislikes -->
        <div ref="reactions" class="flex items-center gap-6 mb-8">
          <button @click="handleLike" class="flex items-center gap-2 text-green-600">
           <Icon icon="solar:like-broken" />
            <span class="text-xl font-bold">{{ post.likes }}</span>
          </button>

          <button @click="handleDislike" class="flex items-center gap-2 text-red-600">
            <Icon icon="solar:dislike-broken" />
            <span class="text-xl font-bold">{{ post.dislikes }}</span>
          </button>
        </div>

        <!-- Blog Content -->
        <div ref="content" class="prose prose-lg max-w-none">
          <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ post.content }}</div>
        </div>
      </article>

      <!-- Comments Section -->
      <div ref="commentsSection" class="bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Comments ({{ comments?.length }})
        </h2>

        <!-- Add Comment Form -->
        <div class="mb-8">
          <textarea
            v-model="newComment"
            placeholder="Write your comment..."
            class="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
            rows="4"
          ></textarea>

          <button
            @click="handleAddComment"
            :disabled="!newComment.trim()"
            class="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Post Comment
          </button>
        </div>

        <!-- Comments List -->
        <div class="space-y-6">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <img
                :src="comment.userImage"
                :alt="comment.userName"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
              />
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-gray-900">{{ comment.userName }}</h3>
                  <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="text-gray-700 leading-relaxed">{{ comment.text }}</p>
              </div>
            </div>
          </div>

          <div v-if="comments?.length === 0" class="text-center py-12">
            <p class="text-gray-400 text-lg">No comments yet. Be the first to comment!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  useAddComment,
  useBlog,
  useComments,
  useDislikeBlog,
  useLikeBlog
} from "./useBlog";

import type { Comment } from "../../types/database";
import { Icon } from "@iconify/vue";

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const id = router.currentRoute.value.params.id as string;

//  Fetch blog
const { data: post, error, isLoading } = useBlog(id);

//  Fetch comments from Firestore
const { data: commentsData } = useComments(id);

//  Mutations
const { mutate: likeBlog } = useLikeBlog(id);
const { mutate: dislikeBlog } = useDislikeBlog(id);
const { mutate: addCommentMutation } = useAddComment();

// Local state
const newComment = ref("");

// Refs for animations
const backBtn = ref<HTMLElement | null>(null);
const heroImage = ref<HTMLElement | null>(null);
const title = ref<HTMLElement | null>(null);
const authorInfo = ref<HTMLElement | null>(null);
const reactions = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const commentsSection = ref<HTMLElement | null>(null);

//  Computed comments from vue-query
const comments = computed(() => post.value?.comments || []);



//  Add Comment
const handleAddComment = () => {
  if (!newComment.value.trim()) return;
post.value?.comments.push({
    id: Date.now().toString(),
    text: newComment.value,
    createdAt: new Date().toISOString(),
    userName: "Current User",
    userImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop"
  });
  addCommentMutation({
    postId: id,
    text: newComment.value,
    userName: "Current User",
    userImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop"
  });

  newComment.value = "";
};

//  Like
const handleLike = () => {
  likeBlog();
};

//  Dislike
const handleDislike = () => {
  dislikeBlog();
};

//  Date formatter
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

//  Go back
const goBack = () => {
  router.push("/blog");
};

//  Animations
onMounted(() => {
  if (isLoading.value || error.value) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(backBtn.value, { opacity: 0, x: -20, duration: 0.6 })
    .from(heroImage.value, { opacity: 0, scale: 0.95, duration: 0.8 }, "-=0.4")
    .from(title.value, { opacity: 0, y: 30, duration: 0.6 }, "-=0.4")
    .from(authorInfo.value, { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
    .from(reactions.value, { opacity: 0, x: -20, duration: 0.6 }, "-=0.4")
    .from(content.value, { opacity: 0, y: 30, duration: 0.8 }, "-=0.4");

  gsap.from(commentsSection.value, {
    scrollTrigger: {
      trigger: commentsSection.value,
      start: "top 80%"
    },
    opacity: 0,
    y: 50,
    duration: 0.8
  });
});
</script>


<style scoped>
.prose {
  font-size: 1.125rem;
  line-height: 1.75;
}

@media (max-width: 640px) {
  .prose {
    font-size: 1rem;
    line-height: 1.625;
  }
}
</style>