<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getProperties, getStats } from "@/services/api";

const route = useRoute();
const properties = ref([]);
const stats = ref(null);
const loading = ref(true);
const viewMode = ref('grid'); // 'grid' or 'table'

const filters = ref({
  obreb: route.query.obreb || (route.query.search || route.query.numerDzialki ? "" : "Chrapczew"),
  numerDzialki: route.query.numerDzialki || "",
  search: route.query.search || ""
});

const loadData = async () => {
  loading.value = true;
  properties.value = await getProperties(filters.value);
  loading.value = false;
};

const resetFilters = () => {
  filters.value = { 
    obreb: "Chrapczew", 
    numerDzialki: "", 
    search: "" 
  };
};

onMounted(async () => {
  stats.value = await getStats();
  await loadData();
});

watch(() => route.query.search, (newVal) => {
  if (newVal) {
    filters.value.search = newVal;
    loadData();
  }
});

watch(() => filters.value.obreb, loadData);
watch(() => filters.value.numerDzialki, loadData);
watch(() => filters.value.search, loadData);

const formatCurrency = (value) => {
  if (!value) return "-";
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(value);
};

const formatArea = (value) => {
  if (!value) return "-";
  return value.toLocaleString('pl-PL') + " m²";
};
</script>

<template>
  <div class="container mx-auto px-6 max-w-7xl">
    <!-- Filter Section -->
    <div class="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl mb-12 border border-gray-100 relative z-30" data-aos="fade-down">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Obręb geodezyjny</label>
          <select 
            v-model="filters.obreb"
            class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-lightGreen focus:bg-white focus:outline-none transition-all font-Inter font-medium text-brandGreen"
          >
            <option value="">Wszystkie obręby</option>
            <option v-for="stat in stats?.obrebStats" :key="stat._id" :value="stat._id">
              {{ stat._id }} ({{ stat.count }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Numer działki</label>
          <input 
            v-model="filters.numerDzialki"
            type="text" 
            placeholder="np. 123/4..."
            class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-lightGreen focus:bg-white focus:outline-none transition-all font-Inter font-medium text-brandGreen placeholder-gray-300"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">Szybkie wyszukiwanie</label>
          <div class="relative">
            <input 
              v-model="filters.search"
              type="text" 
              placeholder="Szukaj wszędzie..."
              class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-lightGreen focus:bg-white focus:outline-none transition-all font-Inter font-medium text-brandGreen placeholder-gray-300"
            />
            <i class="pi pi-search absolute right-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      <div class="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl">
        <button 
          @click="viewMode = 'grid'" 
          class="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
          :class="viewMode === 'grid' ? 'bg-white text-brandGreen shadow-md' : 'text-gray-400 hover:text-brandGreen'"
        >
          <i class="pi pi-th-large"></i> Siatka
        </button>
        <button 
          @click="viewMode = 'table'" 
          class="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
          :class="viewMode === 'table' ? 'bg-white text-brandGreen shadow-md' : 'text-gray-400 hover:text-brandGreen'"
        >
          <i class="pi pi-list"></i> Wykaz
        </button>
      </div>

      <div class="flex items-center gap-8">
        <p class="text-sm font-medium text-gray-400">
          Znaleziono: <span class="text-brandGreen font-bold">{{ properties.length }}</span> pozycji
        </p>
        <button @click="resetFilters" class="text-brandGreen hover:text-lightGreen text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
          <i class="pi pi-refresh"></i> Resetuj
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-lightGreen"></div>
    </div>

    <div v-else-if="properties.length === 0" class="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-inner">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="pi pi-search text-3xl text-gray-200"></i>
      </div>
      <p class="text-xl text-gray-400 font-Inter font-medium">Brak wyników spełniających kryteria.</p>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="property in properties" :key="property._id" 
           class="bg-white rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-50 group flex flex-col"
           data-aos="fade-up">
        <div class="p-8 flex-grow">
          <div class="flex justify-between items-start mb-8">
            <span class="px-4 py-1.5 bg-softGreen text-brandGreen text-[10px] font-black rounded-full uppercase tracking-widest">Nr {{ property.lp }}</span>
            <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lightGreen group-hover:bg-lightGreen group-hover:text-white transition-colors">
                <i class="fa-solid fa-map-location-dot"></i>
            </div>
          </div>
          
          <h3 class="text-2xl font-bold font-Inter text-brandGreen mb-1">{{ property.obreb }}</h3>
          <p class="text-gray-400 text-sm mb-8 font-medium">Działka nr <span class="text-brandGreen font-bold">{{ property.numerDzialki }}</span></p>

          <div class="grid grid-cols-2 gap-4 border-y border-gray-50 py-6 mb-8">
            <div>
              <p class="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black mb-1.5">Powierzchnia</p>
              <p class="font-bold text-brandGreen font-Inter">{{ formatArea(property.powierzchnia) }}</p>
            </div>
            <div>
              <p class="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black mb-1.5">Wartość szac.</p>
              <p class="font-bold text-lightGreen font-Inter">{{ formatCurrency(property.wartosc) }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400">
                <i class="fa-solid fa-landmark text-xs"></i>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed font-medium"><span class="block text-[9px] uppercase font-black tracking-widest text-gray-300 mb-1">Użytki</span> {{ property.uzytki || '-' }}</p>
            </div>
            <div class="flex items-start gap-4">
               <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400">
                <i class="fa-solid fa-file-contract text-xs"></i>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium"><span class="block text-[9px] uppercase font-black tracking-widest text-gray-300 mb-1">Przeznaczenie</span> {{ property.przeznaczenie || '-' }}</p>
            </div>
          </div>
        </div>
        <div class="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
          <router-link :to="{ name: 'property-detail', params: { id: property._id } }" class="flex items-center justify-center gap-2 w-full py-4 bg-white text-brandGreen font-black rounded-2xl hover:bg-brandGreen hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg uppercase tracking-[0.2em] text-[10px]">
            Zobacz szczegóły
            <i class="pi pi-arrow-right text-[10px]"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100" data-aos="fade-up">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-brandGreen text-white uppercase text-[10px] tracking-widest font-black">
              <th class="px-8 py-6">Lp</th>
              <th class="px-6 py-6">Obręb</th>
              <th class="px-6 py-6">Nr Działki</th>
              <th class="px-6 py-6">Powierzchnia</th>
              <th class="px-6 py-6">Wartość</th>
              <th class="px-8 py-6 text-center">Akcja</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="property in properties" :key="property._id" class="hover:bg-softGreen transition-colors group">
              <td class="px-8 py-5 text-xs font-bold text-gray-400">{{ property.lp }}</td>
              <td class="px-6 py-5 text-sm font-bold text-brandGreen">{{ property.obreb }}</td>
              <td class="px-6 py-5 text-sm font-medium text-gray-600">{{ property.numerDzialki }}</td>
              <td class="px-6 py-5 text-sm font-bold text-brandGreen">{{ formatArea(property.powierzchnia) }}</td>
              <td class="px-6 py-5 text-sm font-bold text-lightGreen">{{ formatCurrency(property.wartosc) }}</td>
              <td class="px-8 py-5">
                <router-link :to="{ name: 'property-detail', params: { id: property._id } }" class="flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 text-brandGreen font-black rounded-xl hover:bg-brandGreen hover:text-white transition-all text-[9px] uppercase tracking-widest">
                  Szczegóły
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
