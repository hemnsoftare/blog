<template>
  <section ref="sec" class="py-20 w-11/12 mx-auto">
    <h2 class="text-3xl font-bold mb-10">How We Work</h2>

    <div class="flex flex-col gap-12">
      <PartTwoItem
        v-for="(item, i) in items"
        :key="i"
        :reverse="i % 2 === 1"
        :title="item.title"
        :text="item.text"
            :image="item.image"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import PartTwoItem from './SEC_tow_item.vue'

const sec = ref<HTMLElement | null>(null)

interface Item {
     title: string
     text: string
     image?: string
}

const items: Item[] = [
     { title: 'Research', text: 'We dive deep into every topic to understand requirements, market trends, and user needs thoroughly.' , image : '/bmw 4.jpg' },
     { title: 'Design', text: 'Layouts crafted with clarity, ensuring intuitive user experiences and visual excellence.' , image : '/bmw 3.jpg' },
     { title: 'Development', text: 'Building robust and scalable solutions using modern technologies and best practices.' , image: '/bmw 2.jpg' },
     { title: 'Launch', text: 'Deploying and monitoring with precision — ready for users and optimized for performance.', image: '/bmw 1.jpg' }
]

onMounted(() => {
  gsap.from(sec.value, {
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power2.out'
  })
})
</script>
