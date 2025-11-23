<script setup lang="ts">
import { ref } from 'vue';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import BlogCard from '../post/components/BlogCard.vue';
import Herro from './components/Hero.vue';
import { db } from '../../lib/firebase';
import { useAllBlogs } from '../post/useBlog';
// --------------------
// 🔹 Type Definitions
// --------------------
interface Author {
  name: string;
  profileImage: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  image: string;
  author: Author;
  date: string;
}

const {data: blogPosts , isLoading} = useAllBlogs()
if (isLoading) {
  // You can show a loading indicator here if needed
  console.log('Loading blog posts...');
}else{
  console.log(blogPosts)
}
</script>

<template>
  <Herro />
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
    <blog-card
      v-for="post in blogPosts"
      :key="post.id"
      :post="post"
      class="cursor-pointer hover:scale-105 transition-transform"
    />
  </div>
</template>

<style scoped>
/* Optional hover styling */
.blog-card:hover {
  transform: scale(1.03);
  transition: transform 0.2s ease;
}
</style>
