<template>
  <section
    ref="heroRef"
    class="w-full py-20 flex flex-col items-center text-center"
  >
    <img :src="CarHero" alt="CarHero" class="max-w-screen h-56 mb-6" />
    <h1 class="text-4xl font-bold mb-4">About Our Blog</h1>
    <p class="max-w-2xl text-gray-600 text-lg">
      A space where ideas grow, stories breathe, and creativity finds its road.
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat ipsam ab sunt aut odio pariatur voluptate et reiciendis velit, ut neque, dolores alias nemo ipsa quas inventore. Consequatur, quas cumque.
    </p>
  </section>
</template>

<script setup lang="ts">
import CarHero from '../../../../assets/CarHero.png'
</script>
