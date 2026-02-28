<script setup>
import { onMounted } from "vue";
import OrderStatus from "@/components/OrderStatus.vue";
import { getFrontpageData, getPageData } from "@/services/api";
import { updateMetaTags } from "@/utils/seo";

onMounted(async () => {
  const pageData = await getPageData('order-status');
  const frontData = await getFrontpageData();
  
  if (pageData) {
    updateMetaTags(
      pageData.metaTitle || 'Status Zlecenia - JUNKIERT INVESTMENT', 
      pageData.metaDescription || 'Sprawdź aktualny status swojego zlecenia geodezyjnego.'
    );
  } else if (frontData) {
    updateMetaTags(
      'Status Zlecenia - JUNKIERT INVESTMENT', 
      'Sprawdź aktualny status swojego zlecenia geodezyjnego w Pracowni Geodezyjnej JUNKIERT INVESTMENT.'
    );
  }
});
</script>

<template>
  <div class="min-h-[60vh] flex flex-col justify-center py-12">
    <OrderStatus />
  </div>
</template>

<style scoped>
</style>
