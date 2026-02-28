<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getPropertyById } from "@/services/api";
import { updateMetaTags } from "@/utils/seo";
import GeoportalMap from "@/components/GeoportalMap.vue";
import heroImage from "@/assets/img/dobra.jpg";

const route = useRoute();
const property = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const data = await getPropertyById(route.params.id);
    if (data) {
      property.value = data;
      updateMetaTags(
        `Działka ${data.numerDzialki} (${data.obreb}) - Gmina Dobra`,
        `Szczegółowe informacje o działce nr ${data.numerDzialki} w obrębie ${data.obreb}.`
      );
    } else {
      error.value = "Nie znaleziono nieruchomości.";
    }
  } catch (err) {
    error.value = "Wystąpił błąd podczas ładowania danych.";
  } finally {
    loading.value = false;
  }
});

const formatCurrency = (value) => {
  if (!value) return "-";
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(value);
};

const formatArea = (value) => {
  if (!value) return "-";
  return value.toLocaleString('pl-PL') + " m²";
};

const handlePrint = () => {
  window.print();
};

const eMapaLink = computed(() => {
    if (!property.value) return "";
    if (property.value.teryt) {
        return `https://dobraturecka.e-mapa.net?identifyParcel=${property.value.teryt}`;
    }
    const query = `obręb ${property.value.obreb} działka ${property.value.numerDzialki}`;
    return `https://dobraturecka.e-mapa.net/?query=${encodeURIComponent(query)}`;
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Print-only Header (Hidden on screen) -->
    <div class="hidden print:block mb-8 border-b-2 border-slate-900 pb-6">
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-black uppercase">Karta Nieruchomości</h1>
                <p class="text-sm font-bold text-slate-600">Urząd Miejski w Dobrej</p>
            </div>
            <img src="@/assets/logo.png" alt="Logo" class="h-16" />
        </div>
    </div>

    <!-- Compact Header (Hidden on print) -->
    <section class="relative h-[200px] md:h-[250px] flex items-center justify-center text-white overflow-hidden print:hidden">
      <div class="absolute inset-0 z-0">
        <img :src="heroImage" alt="Nieruchomość" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-navyBlue/80"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10 text-center pt-12 md:pt-16">
        <div class="mb-4 flex justify-center">
            <router-link to="/properties" class="text-[10px] font-black uppercase tracking-[0.2em] text-yellowMain/60 hover:text-yellowMain transition-colors flex items-center gap-2">
                <i class="pi pi-arrow-left"></i> Powrót do wykazu
            </router-link>
        </div>
        <h1 v-if="property" class="text-3xl md:text-5xl font-black font-outfit mb-2">Działka {{ property.numerDzialki }}</h1>
        <p v-if="property" class="text-yellowMain uppercase tracking-[0.3em] font-bold text-xs md:text-sm">{{ property.obreb }}</p>
      </div>
    </section>

    <div class="container mx-auto px-6 max-w-7xl mt-8 md:mt-12 relative z-20 pb-20 print:m-0 print:p-0 print:max-w-none">
      <div v-if="loading" class="bg-white rounded-[2.5rem] p-20 shadow-xl text-center print:hidden">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-portalAccent mx-auto"></div>
      </div>

      <div v-else-if="error" class="bg-white rounded-[2.5rem] p-20 shadow-xl text-center">
        <i class="pi pi-exclamation-circle text-5xl text-red-500 mb-6"></i>
        <p class="text-xl font-bold text-slate-800">{{ error }}</p>
        <router-link to="/properties" class="mt-8 inline-block px-8 py-4 bg-portalAccent text-white rounded-xl font-bold">Wróć do listy</router-link>
      </div>

      <div v-else-if="property" class="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
        <!-- Sidebar: Info Cards -->
        <div class="lg:col-span-1 space-y-6 print:mb-8">
          <div class="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 print:shadow-none print:p-0 print:border-0">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 print:text-slate-900 print:text-lg">
                <span class="w-1.5 h-4 bg-portalAccent rounded-full print:hidden"></span>
                Dane techniczne
            </h3>
            
            <div class="space-y-6 print:grid print:grid-cols-2 print:space-y-0 print:gap-4">
              <div class="print:border-b print:pb-2">
                <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 print:text-slate-500">Numer porządkowy</span>
                <span class="text-xl font-black text-slate-800">Poz. {{ property.lp }}</span>
              </div>
              
              <div class="print:border-b print:pb-2">
                <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 print:text-slate-500">Obręb geodezyjny</span>
                <span class="text-xl font-black text-slate-800">{{ property.obreb }}</span>
              </div>

              <div class="print:border-b print:pb-2">
                <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 print:text-slate-500">Numer działki</span>
                <span class="text-xl font-black text-slate-800">{{ property.numerDzialki }}</span>
              </div>

              <div class="print:border-b print:pb-2">
                <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 print:text-slate-500">Powierzchnia</span>
                <span class="text-xl font-black text-slate-800">{{ formatArea(property.powierzchnia) }}</span>
              </div>

              <div class="print:border-b print:pb-2">
                <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 print:text-slate-500">Wartość szacunkowa</span>
                <span class="text-xl font-black text-portalAccent">{{ formatCurrency(property.wartosc) }}</span>
              </div>

              <div class="print:border-b print:pb-2">
                <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 print:text-slate-500">Użytki</span>
                <span class="text-sm font-bold text-slate-600">{{ property.uzytki || 'Brak danych' }}</span>
              </div>

              <div class="lg:col-span-2 print:col-span-2 mt-4">
                <span class="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 print:text-slate-500">Przeznaczenie w studium</span>
                <p class="text-sm font-medium text-slate-500 leading-relaxed print:text-slate-800">{{ property.przeznaczenie || 'Brak informacji o przeznaczeniu w bazie danych.' }}</p>
              </div>
            </div>
          </div>

          <!-- Actions (Hidden on print) -->
          <div class="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white print:hidden">
            <h3 class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-6">Dostępne akcje</h3>
            <div class="grid grid-cols-1 gap-3">
                <a :href="eMapaLink" target="_blank" class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-white/5 cursor-pointer">
                    <span class="text-sm font-bold">Otwórz w e-mapa</span>
                    <i class="pi pi-external-link text-portalAccent group-hover:translate-x-1 transition-transform"></i>
                </a>
                <button @click="handlePrint" class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group border border-white/5 cursor-pointer text-left w-full">
                    <span class="text-sm font-bold">Drukuj kartę</span>
                    <i class="pi pi-print text-portalAccent"></i>
                </button>
            </div>
          </div>
        </div>

        <!-- Main: Map & Visuals -->
        <div class="lg:col-span-2 space-y-8 print:block">
          <div class="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 h-[500px] md:h-[600px] relative print:h-[400px] print:rounded-none print:border-2 print:border-slate-200">
            <div class="absolute top-6 left-6 z-30 pointer-events-none print:hidden">
                <div class="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white flex items-center gap-3">
                    <i class="pi pi-map-marker text-portalAccent"></i>
                    <span class="text-[10px] font-black text-slate-800 uppercase tracking-widest">Lokalizacja na mapie</span>
                </div>
            </div>
            
            <GeoportalMap 
              v-if="property.wkt"
              :selectedParcel="{ id: property.obreb + ' ' + property.numerDzialki, name: property.numerDzialki, wkt: property.wkt }"
              :center="[51.91, 18.61]"
              :zoom="16"
            />
          </div>

          <div class="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 print:shadow-none print:p-0 print:border-0 print:mt-8">
            <div class="flex items-center gap-6 mb-8 print:mb-4">
                <div class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-portalAccent text-2xl shadow-inner print:hidden">
                    <i class="pi pi-info-circle"></i>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 tracking-tight print:text-lg">Nota prawna</h3>
                    <p class="text-slate-400 text-sm font-bold uppercase tracking-widest print:hidden">Informacja o danych</p>
                </div>
            </div>
            <p class="text-slate-500 leading-relaxed text-lg print:text-xs print:text-slate-600">
                Prezentowane dane mają charakter wyłącznie poglądowy i nie stanowią dokumentu urzędowego w rozumieniu przepisów prawa. Dokładne informacje o granicach oraz statusie prawnym nieruchomości można uzyskać w Wydziale Geodezji i Gospodarki Nieruchomościami Starostwa Powiatowego w Turku.
            </p>
            <div class="hidden print:block mt-12 text-[10px] text-slate-400 italic">
                Wydrukowano z portalu mienia komunalnego Gminy Dobra w dniu: {{ new Date().toLocaleDateString('pl-PL') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
    :deep(header), :deep(footer), .print\:hidden {
        display: none !important;
    }
    
    .bg-gray-50 {
        background-color: white !important;
    }

    .container {
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
    }

    /* Wymuszamy widoczność mapy na wydruku */
    :deep(.leaflet-control-container) {
        display: none !important;
    }
    
    .lg\:col-span-1, .lg\:col-span-2 {
        width: 100% !important;
    }

    h1, h2, h3, span, p {
        color: black !important;
    }

    .text-portalAccent {
        color: #dc2626 !important;
    }
}
</style>
