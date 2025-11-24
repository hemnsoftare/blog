<!-- Path: feature-modules/information/About.vue -->
<template>
  <div class="w-full min-h-screen bg-white text-blue-600 overflow-hidden">
    <div v-for="(section, i) in sections" :key="i" :ref="section.ref">
      <component :is="section.component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Import section components
import HeroAbout from "./components/about/HeroAbout.vue";
import PartOne from "./components/about/SEC_one.vue";
import PartTwo from "./components/about/SEC_tow.vue";
import PartThree from "./components/about/SEC_three.vue";
import PartFour from "./components/about/SEC_four.vue";

// Create a typed section list
const sections = [
  { ref: ref<HTMLElement | null>(null), component: HeroAbout },
  { ref: ref<HTMLElement | null>(null), component: PartOne },
  { ref: ref<HTMLElement | null>(null), component: PartTwo },
  { ref: ref<HTMLElement | null>(null), component: PartThree },
  { ref: ref<HTMLElement | null>(null), component: PartFour }
];

onMounted(() => {
  sections.forEach(({ ref }) => {
    if (!ref.value) return;

    gsap.from(ref.value, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.value,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });
});
</script>
