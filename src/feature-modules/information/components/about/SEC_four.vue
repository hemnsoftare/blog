<template>
  <section ref="sec" class="py-20 w-11/12 mx-auto">
    <h2 class="text-3xl font-bold mb-10">Our Story</h2>

    <PartFourItem />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import PartFourItem from './SEC_four_item.vue'

const sec = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(sec.value, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power2.out'
  })
})
</script>
