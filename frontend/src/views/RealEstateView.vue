<script setup>
import { ref, onMounted } from 'vue';
import GeoportalMap from '@/components/GeoportalMap.vue';
import axios from 'axios';

const properties = ref([]);
const selectedProperty = ref(null);
const loading = ref(true);

// Współrzędne miejscowości (obrębów) dla Twojej gminy Dobra
const precinctCoords = {
  "Chrapczew": [51.9194, 18.6473],
  "Czajków": [51.92, 18.65],
  "Dąbrowica": [51.93, 18.66],
  "Czyste": [51.94, 18.67],
  "Dąbrowica-Kolonia": [51.935, 18.665],
  // ... resztę uzupełnimy
};

onMounted(async () => {
  try {
    // W prawdziwym systemie pobierzesz to z Twojego API (backend/routes/properties.js)
    // Na razie załadujemy plik lokalnie z folderu public (jeśli tam go skopiujemy)
    // lub użyjemy testowych danych.
    const response = await axios.get('/api/properties/list'); // Załóżmy, że backend to obsługuje
    properties.value = response.data.slice(0, 100); // Pierwsze 100 rekordów
  } catch (err) {
    console.error("Błąd wczytywania nieruchomości:", err);
  } finally {
    loading.value = false;
  }
});

const selectOnMap = (prop) => {
  const coords = precinctCoords[prop.obreb] || [51.91, 18.61];
  selectedProperty.value = {
    lat: coords[0],
    lon: coords[1],
    label: prop.numerDzialki
  };
};
</script>

<template>
  <div class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-bold text-navyBlue mb-8 font-Rubik">Portal Nieruchomości Gminnych</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Lewa kolumna: MAPA -->
      <div class="lg:col-span-7 sticky top-24 h-fit">
        <GeoportalMap 
          :selectedPoint="selectedProperty"
          :center="[51.91, 18.61]"
          :zoom="13"
        />
        <div class="mt-4 p-4 bg-yellowMain/10 border-2 border-yellowMain rounded-2xl">
          <p class="font-bold text-navyBlue">Jak to działa?</p>
          <p class="text-sm opacity-80">Kliknij na działkę z listy po prawej, a mapa automatycznie nałoży warstwę granic z oficjalnego serwera GUGiK.</p>
        </div>
      </div>

      <!-- Prawa kolumna: LISTA -->
      <div class="lg:col-span-5 h-[800px] overflow-y-auto pr-4">
        <div v-if="loading" class="text-center py-20">
          <i class="pi pi-spin pi-spinner text-4xl text-yellowMain"></i>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="prop in properties" 
            :key="prop._id"
            @click="selectOnMap(prop)"
            class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-yellowMain transition-all cursor-pointer group"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs uppercase font-bold text-yellowMain tracking-widest">{{ prop.obreb }}</p>
                <h3 class="text-xl font-bold text-navyBlue">Działka nr: {{ prop.numerDzialki }}</h3>
              </div>
              <div class="bg-navyBlue text-white px-3 py-1 rounded-full text-xs font-bold">
                {{ prop.powierzchnia }} m²
              </div>
            </div>
            
            <div class="mt-4 flex gap-4 text-sm text-gray-500">
              <span><i class="pi pi-map mr-2"></i>{{ prop.uzytki }}</span>
              <span><i class="pi pi-money-bill mr-2"></i>{{ prop.wartosc }} PLN</span>
            </div>

            <button class="mt-6 w-full py-3 bg-gray-50 group-hover:bg-yellowMain rounded-xl text-navyBlue font-bold transition-colors">
              Pokaż na mapie
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #002D5B;
  border-radius: 10px;
}
</style>
