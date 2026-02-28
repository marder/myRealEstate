<script setup>
import { inject, computed } from "vue";
import { RouterLink } from "vue-router";

const frontpageData = inject('frontpageData');

const stripeText = computed(() => frontpageData.value?.stripe || "Chcesz poznać pełną ofertę naszych usług?");
</script>

<template>
  <!-- CTA Section -->
  <section id="cta" class="bg-yellowMain py-20 relative overflow-hidden">
    <!-- Decorative background patterns (subtle white circles) -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-navyBlue/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
    
    <div class="container mx-auto px-6 relative z-10">
      <div class="bg-white/30 backdrop-blur-sm border border-white/40 rounded-[3rem] p-8 md:p-16">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
          
          <!-- Heading & Text -->
          <div class="max-w-2xl space-y-4">
            <h2 class="font-Rubik text-4xl md:text-5xl font-bold text-navyBlue leading-tight">
              {{ stripeText }}
            </h2>
            <p class="text-navyBlue/80 text-lg md:text-xl font-bold italic">
              Sprawdź szczegółowy opis wszystkich prac geodezyjnych i prawnych.
            </p>
          </div>

          <!-- Button -->
          <div class="flex-shrink-0">
            <RouterLink
              to="/offer"
              class="group inline-flex items-center gap-4 px-10 py-5 bg-navyBlue text-white font-extrabold rounded-full shadow-2xl hover:bg-white hover:text-navyBlue hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Poznaj ofertę
              <i class="pi pi-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </RouterLink>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Subtle grain or texture could be added here if needed */
</style>
