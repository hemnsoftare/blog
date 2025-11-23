<template>
  <div class="max-w-screen h-screen flex items-center justify-center flex-col overflow-hidden">
    <h1 class="text-6xl md:text-8xl font-bold font-serif italic relative top-32 z-50 text-gray-800 mt-5 animate-title">
      HCar
    </h1>
    <img 
      :src="CarHero" 
      alt="Car" 
      class="w-11/12 sm:w-9/12 -z-30 md:w-8/12 lg:w-8/12 xl:w-7/12 h-auto animate-car" 
    />
  </div>
</template>

<script setup lang="ts">
import CarHero from '../../../../src/assets/hero.png';
</script>

<style scoped>
/* Remove background from image using CSS filter */


@keyframes carDriveIn {
  0% {
    opacity: 0;
    transform: translate(-120vw, -120vh) scale(0.7);
  }
  70% {
    transform: translate(10px, -10px) scale(1.05);
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

.animate-car {
  animation: carDriveIn 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-car {
  animation: carDriveIn 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

/* Prevent horizontal scroll */
body {
  overflow-x: hidden;
}
</style>