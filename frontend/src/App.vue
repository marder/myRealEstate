<script setup>
import { ref, onMounted, provide, computed } from "vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { RouterView, useRoute } from "vue-router";
import { getFrontpageData } from "@/services/api";

const frontpageData = ref(null);
const route = useRoute();

const isMapPage = computed(() => route.path === '/map');

onMounted(async () => {
  frontpageData.value = await getFrontpageData();
});

provide('frontpageData', frontpageData);
</script>

<template>
  <Navbar />
  <RouterView />
  <Footer v-if="!isMapPage" />
</template>
