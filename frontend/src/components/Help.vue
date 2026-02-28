<script setup>
import { ref, onMounted } from "vue";
import { getFrontpageData } from "@/services/api";

const services = ref([
  { title: "Tyczenia, prace realizacyjne", icon: "fa-solid fa-globe" },
  { title: "Inwentaryzacje powykonawcze", icon: "fa-solid fa-map-location-dot" },
  { title: "Podziały nieruchomości", icon: "fa-solid fa-object-ungroup" },
  { title: "Połączenia działek ewidencyjnych", icon: "fa-solid fa-object-group" },
  { title: "Ustalenie granic nieruchomości", icon: "fa-solid fa-border-top-left" },
  { title: "Wznowienia znaków granicznych", icon: "fa-solid fa-location-dot" },
  { title: "Sporządzanie dokumentacji", icon: "fa-solid fa-file-contract" },
  { title: "Geodezyjna obsługa inwestycji", icon: "fa-solid fa-road-barrier" },
  { title: "Wykazy synchronizacyjne", icon: "fa-solid fa-list-check" },
  { title: "Badanie stanu prawnego", icon: "fa-solid fa-magnifying-glass" },
  { title: "Mapy do celów projektowych", icon: "fa-regular fa-map" },
  { title: "Inne opracowania geodezyjne", icon: "fa-solid fa-compass-drafting" }
]);

onMounted(async () => {
  const data = await getFrontpageData();
  if (data && data.additionalServices && data.additionalServices.length > 0) {
    services.value = data.additionalServices;
  }
});
</script>

<template>
  <section id="help" class="bg-gray-50 py-20">
    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-navyBlue text-4xl md:text-5xl font-bold font-Rubik mb-6 relative inline-block">
          Oferujemy usługi w postaci:
          <span class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-yellowMain rounded-full"></span>
        </h2>
        <p class="text-gray-600 mt-8 text-lg">
          Zapewniamy kompleksową obsługę geodezyjną dla klientów indywidualnych oraz firm. 
          Gwarantujemy precyzję, terminowość i profesjonalne doradztwo.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="(service, index) in services" 
          :key="index"
          class="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 flex flex-col items-center text-center"
        >
          <!-- Icon Container -->
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex justify-center items-center mb-6 group-hover:bg-yellowMain transition-colors duration-300">
            <i :class="[service.icon, 'text-3xl text-navyBlue group-hover:scale-110 transition-transform duration-300']"></i>
          </div>
          
          <!-- Title -->
          <h3 class="font-bold font-Rubik text-navyBlue text-lg leading-snug">
            {{ service.title }}
          </h3>
          
          <!-- Decorative element -->
          <div class="mt-4 w-8 h-1 bg-gray-100 group-hover:w-16 group-hover:bg-yellowMain transition-all duration-300 rounded-full"></div>
        </div>
      </div>

      <!-- CTA in section -->
      <div class="mt-16 text-center">
        <RouterLink to="/properties" class="inline-flex items-center gap-2 font-bold text-navyBlue hover:text-yellowMain transition-colors group">
          Zobacz pełny zakres naszych usług
          <i class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom shadow for extra depth */
.shadow-sm {
  box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.05);
}
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.1);
}
</style>
