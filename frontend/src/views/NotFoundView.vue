<script setup>
import CTA from "@/components/CTA.vue";
</script>

<template>
    <div class="py-20 text-center bg-gray-50">
        <h1 class="text-6xl font-bold text-navyBlue mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-10">Przepraszamy, strona której szukasz nie istnieje.</p>
        <router-link to="/" class="px-8 py-3 bg-yellowMain text-navyBlue font-bold rounded-full hover:bg-navyBlue hover:text-white transition-all">
            Wróć do strony głównej
        </router-link>
    </div>
    <CTA />
</template>
