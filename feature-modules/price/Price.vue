<template>
  <div class="min-h-screen w-full flex flex-col items-center py-16">
    <h1 class="text-4xl font-jost font-bold mb-10 text-gray-800">Choose Your Plan</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-10/12">
      <CardPrice
        v-for="(plan, index) in plans"
        :key="plan.id"
        :plan="plan"
        @select="handleSelect"
        ref="el => cardRefs[index] = el"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import CardPrice from "./componet/CardPrice.vue";
import type { Plan } from "./type";

const plans: Plan[] = [
  {
    id: 1,
    name: "Free",
    price: "$0",
    features: ["Create up to 3 posts per month", "Basic support"],
  },
  {
    id: 2,
    name: "Starter",
    price: "$9.99",
    features: ["Create up to 30 posts per month", "Better support", "Higher visibility"],
  },
  {
    id: 3,
    name: "Pro",
    price: "$19.99",
    features: [
      "Create up to 30 posts",
      "Like posts",
      "Dislike posts",
      "Comment on posts",
      "Priority support",
    ],
  },
];

// Type-safe refs for child components
const cardRefs = ref<InstanceType<typeof CardPrice>[]>([]);

const handleSelect = (planId: number) => {
  console.log("Selected plan:", planId);
};

onMounted(() => {
  const elements = cardRefs.value.map(c => c.$el as HTMLElement);
  gsap.from(elements, {
    duration: 1,
    y: 120,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out",
  });
});
</script>
