<template>
  <Navbar />
  <div id="app">
    <router-view></router-view> <!-- This will render the components based on the current route -->
  </div>
</template>

<script>
import Navbar from './components/navbar/Navbar.vue';
export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style>
/* Add your globalf  styles here addedkhjkgjk */
</style>
    