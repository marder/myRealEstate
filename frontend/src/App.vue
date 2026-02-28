<script setup>
import { ref, onMounted, provide } from "vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { RouterView } from "vue-router";
import { getFrontpageData } from "@/services/api";

const frontpageData = ref(null);

onMounted(async () => {
  frontpageData.value = await getFrontpageData();
});

provide('frontpageData', frontpageData);
</script>

<template>
  <Navbar />
  <RouterView />
  <Footer />
</template>
