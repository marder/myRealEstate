<script setup>
import { onMounted } from "vue";
import heroImage from "@/assets/img/dobra.jpg";
import PropertyGrid from "@/components/PropertyGrid.vue";
import { getPageData } from "@/services/api";
import { updateMetaTags } from "@/utils/seo";

onMounted(async () => {
  updateMetaTags(
    'Wykaz Nieruchomości - Gmina Dobra', 
    'Szczegółowy wykaz nieruchomości gminnych w Gminie Dobra.'
  );
});
</script>

<template>
  <!-- Header Section -->
  <section class="relative h-[25vh] md:h-[30vh] flex items-center justify-center text-white overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img :src="heroImage" alt="Nieruchomości" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-navyBlue/80"></div>
    </div>
    
    <div class="container mx-auto px-6 relative z-10 text-center pt-16 md:pt-24 pb-12 md:pb-16">
      <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold font-Rubik mb-4" data-aos="fade-down">Wykaz Mienia Gminnego</h1>
      <p class="text-yellowMain uppercase tracking-widest font-bold max-w-2xl mx-auto text-sm md:text-base" data-aos="fade-up">Gmina Dobra - Baza Nieruchomości</p>
      <div class="w-16 h-1 bg-yellowMain mx-auto mt-6 rounded-full" data-aos="zoom-in"></div>
    </div>
  </section>

  <!-- Properties Section -->
  <section class="py-20 bg-gray-50 min-h-screen">
    <PropertyGrid />
  </section>
</template>
