<template>
  <section ref="sec" class="py-20 w-11/12 mx-auto">
    <h2 class="text-3xl font-bold mb-10">Our Values</h2>

    <div class="grid md:grid-cols-3 gap-8">
      <PartThreeItem title="Honesty" text="Truthful writing." />
      <PartThreeItem title="Clarity" text="Simple, focused style." />
      <PartThreeItem title="Creativity" text="Fresh ideas always." />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import PartThreeItem from './SEC_three_item.vue'

const sec = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(sec.value, {
    opacity: 0,
    scale: 0.95,
    duration: 1,
    ease: 'power2.out'
  })
})
</script>
