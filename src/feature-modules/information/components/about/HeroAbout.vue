<template>
  <section
    ref="heroRef"
    class="w-full py-24 flex flex-col items-center text-center bg-gradient-to-b from-white to-gray-50"
  >
    <!-- Image -->
    <img
      :src="CarHero"
      alt="Car Hero"
      class="max-w-xl w-full h-auto mb-10 drop-shadow-xl transform hover:scale-105 transition duration-500"
    />

    <!-- Heading -->
    <h1
      class="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
    >
      About Our Blog
    </h1>

    <!-- Paragraph -->
    <p class="max-w-3xl text-gray-700 text-lg leading-relaxed px-6">
      A space where ideas grow, stories breathe, and creativity finds its road.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat ipsam ab
      sunt aut odio pariatur voluptate et reiciendis velit, ut neque, dolores
      alias nemo ipsa quas inventore. Consequatur, quas cumque.
    </p>
  </section>
</template>

<script setup lang="ts">
import CarHero from '../../../../assets/CarHero.png'
</script>
