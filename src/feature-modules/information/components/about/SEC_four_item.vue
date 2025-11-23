<script setup lang="ts">
import BMW5 from '@/assets/h.jpg'
</script>
<template>
  <div class="section-wrapper">
    <div class="image-box">
<img :src="BMW5" class="img" alt="section image" />
    </div>

    <div class="text-box">
      <h3 class="title">From Small Steps</h3>
      <p class="desc">
        What started as a tiny spark of curiosity grew into a thriving blog
        where passion fuels every article and every insight.
      </p>
    </div>
  </div>
</template>

<style scoped>
.section-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .section-wrapper {
    flex-direction: row;
  }
}

.image-box {
  width: 100%;
  max-width: 50%;
}

.img {
  width: 100%;
  height: 16rem;
  object-fit: cover;
  border-radius: 0.75rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.text-box {
  width: 100%;
  max-width: 50%;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.desc {
  color: #4b5563;
  line-height: 1.65;
}
</style>
