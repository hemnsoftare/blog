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
