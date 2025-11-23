<template>
  <section ref="sec" class="py-20 w-11/12 mx-auto">
    <h2 class="text-3xl font-bold mb-10">Our Mission</h2>

    <div class="grid md:grid-cols-2 gap-8">
     <PartOneItem title="Quality Content" text="We deliver clean, insightful posts." />
     <PartOneItem title="Community Focus" text="Connecting readers and creators." />
     <PartOneItem title="Expert Authors" text="Insights from experienced professionals." />
     <PartOneItem title="Continuous Improvement" text="Evolving with feedback and data." />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import PartOneItem from './SEC_one_item.vue'

const sec = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(sec.value, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power2.out'
  })
})
</script>
