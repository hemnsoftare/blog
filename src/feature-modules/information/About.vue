<!-- Path: feature-modules/information/About.vue -->
<template>
  <div class="w-full min-h-screen bg-white text-blue-600 overflow-hidden">

    <!-- Hero -->
    <div ref="heroRef">
      <HeroAbout />
    </div>

    <!-- Part 1 -->
    <div ref="sec1Ref">
      <PartOne />
    </div>

    <!-- Part 2 -->
    <div ref="sec2Ref">
      <PartTwo />
    </div>

    <!-- Part 3 -->
    <div ref="sec3Ref">
      <PartThree />
    </div>

    <!-- Part 4 -->
    <div ref="sec4Ref">
      <PartFour />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

// Import sections
import HeroAbout from './components/about/HeroAbout.vue'
import PartOne from './components/about/SEC_one.vue'
import PartTwo from './components/about/SEC_tow.vue'
import PartThree from './components/about/SEC_three.vue'
import PartFour from './components/about/SEC_four.vue'

// Refs for scroll animations
const heroRef = ref<HTMLElement | null>(null)
const sec1Ref = ref<HTMLElement | null>(null)
const sec2Ref = ref<HTMLElement | null>(null)
const sec3Ref = ref<HTMLElement | null>(null)
const sec4Ref = ref<HTMLElement | null>(null)

onMounted(() => {
  const sections = [
    heroRef,
    sec1Ref,
    sec2Ref,
    sec3Ref,
    sec4Ref
  ]

  sections.forEach((sec) => {
    gsap.from(sec.value, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sec.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })
  })
})
</script>
