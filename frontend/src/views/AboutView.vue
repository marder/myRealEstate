<script setup>
import { onMounted } from "vue";
import { updateMetaTags } from "@/utils/seo";
import heroImage from "@/assets/img/dobra.jpg";

onMounted(async () => {
  updateMetaTags(
    'O Projekcie - Baza Nieruchomości Gminy Dobra', 
    'Informacje o systemie zarządzania i publikacji danych o mieniu komunalnym Gminy Dobra.'
  );
});
</script>

<template>
  <!-- Hero Section -->
  <section class="relative h-[25vh] md:h-[30vh] flex items-center justify-center text-white overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img :src="heroImage" alt="O projekcie" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-navyBlue/80"></div>
    </div>
    
    <div class="container mx-auto px-6 relative z-10 text-center pt-16 md:pt-24 pb-12 md:pb-16">
      <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold font-Rubik mb-4">O Projekcie</h1>
      <p class="text-yellowMain uppercase tracking-widest font-bold max-w-2xl mx-auto text-sm md:text-base">
        System Zarządzania Mieniem Gminnym - Gmina Dobra
      </p>
      <div class="w-16 h-1 bg-yellowMain mx-auto mt-6 rounded-full"></div>
    </div>
  </section>

  <!-- Content Section -->
  <section class="py-24 bg-gray-50 min-h-screen">
    <div class="container mx-auto px-6 max-w-4xl">
      <div class="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-50 space-y-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-softGreen rounded-bl-full -z-0"></div>
        
        <div class="relative z-10 space-y-8">
            <h2 class="text-3xl font-black text-brandGreen font-Inter border-b-4 border-lightGreen pb-4 inline-block">Cel Platformy</h2>
            <p class="text-gray-500 text-lg leading-relaxed font-medium">
            Platforma ta została stworzona w celu zapewnienia transparentności oraz ułatwienia dostępu do informacji o nieruchomościach stanowiących mienie komunalne Gminy Dobra. 
            Obywatele, inwestorzy oraz instytucje mogą w szybki sposób odnaleźć dane o gruntach, ich lokalizacji, przeznaczeniu oraz oszacowanej wartości.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div class="bg-gray-50 p-8 rounded-3xl border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                <h3 class="text-xl font-bold text-brandGreen mb-4 flex items-center gap-3">
                <i class="pi pi-database text-lightGreen"></i>
                Baza Danych
                </h3>
                <p class="text-gray-400 text-sm leading-relaxed">
                Wykaz zawiera szczegółowe informacje o setkach działek z podziałem na obręby geodezyjne, z uwzględnieniem użytków i przeznaczenia w MPZP.
                </p>
            </div>
            <div class="bg-gray-50 p-8 rounded-3xl border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                <h3 class="text-xl font-bold text-brandGreen mb-4 flex items-center gap-3">
                <i class="pi pi-sync text-lightGreen"></i>
                Aktualizacja
                </h3>
                <p class="text-gray-400 text-sm leading-relaxed">
                Dane są regularnie synchronizowane z wewnętrznymi systemami urzędu, co gwarantuje dostęp do najświeższych informacji o mieniu gminnym.
                </p>
            </div>
            </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
