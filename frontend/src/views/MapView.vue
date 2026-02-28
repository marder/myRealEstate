<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import GeoportalMap from '@/components/GeoportalMap.vue';
import { getProperties } from '@/services/api';

const searchQuery = ref('');
const searchResults = ref([]);
const selectedParcel = ref(null);
const allParcels = ref([]);
const isLoading = ref(false);
const isSidebarOpen = ref(true);
const mapComponent = ref(null);

// Pobierz wszystkie działki z bazy przy starcie
onMounted(async () => {
  try {
    const data = await getProperties();
    allParcels.value = data;
  } catch (error) {
    console.error("Błąd ładowania zasobów:", error);
  }
});

// Funkcja wyszukiwania działki przez PROXY (Backend)
const searchParcel = async () => {
  if (!searchQuery.value) return;
  isLoading.value = true;
  searchResults.value = [];
  
  try {
    const response = await fetch(`/api/geoportal/search?id=${encodeURIComponent(searchQuery.value)}`);
    const data = await response.text();
    
    if (!data || data.trim() === "" || data.includes("HTML")) return;
    
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const count = parseInt(lines[0].trim());

    if (isNaN(count) || count === 0) return;
    
    searchResults.value = lines.slice(1).map(line => {
      const parts = line.split('|');
      let wkt = parts[1] || "";
      if (wkt.includes(';')) wkt = wkt.split(';')[1];

      return {
        id: parts[0],
        name: parts[0].split('.').pop() || parts[0],
        wkt: wkt
      };
    });
  } catch (error) {
    console.error("Błąd wyszukiwania działki:", error);
  } finally {
    isLoading.value = false;
  }
};

const selectParcel = (parcel) => {
  selectedParcel.value = parcel;
  searchResults.value = [];
  searchQuery.value = '';
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

const clearSelection = () => {
  selectedParcel.value = null;
  searchQuery.value = '';
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Kluczowy watcher do odświeżania mapy po zmianie rozmiaru kontenera (sidebar toggle)
watch(isSidebarOpen, async () => {
  await nextTick();
  // Czekamy na zakończenie animacji CSS (500ms)
  setTimeout(() => {
    if (mapComponent.value && mapComponent.value.refreshSize) {
      mapComponent.value.refreshSize();
    }
  }, 550);
});
</script>

<template>
  <div class="map-page-container relative flex overflow-hidden bg-slate-50">
    <!-- Sidebar -->
    <aside 
      class="absolute md:relative z-40 h-full w-full md:w-[380px] bg-white shadow-[20px_0_60px_rgba(0,0,0,0.03)] transition-all duration-500 ease-in-out transform border-r border-slate-100 flex flex-col"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-ml-[380px] md:translate-x-0'"
    >
      <!-- Header -->
      <div class="p-5 border-b border-slate-50 bg-white">
        <div class="flex items-center justify-between mb-5">
          <div>
              <h2 class="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <span class="w-2 h-6 bg-portalAccent rounded-full"></span>
                  Eksplorator
              </h2>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 ml-4">Gmina Dobra / TERYT</p>
          </div>
          <button @click="toggleSidebar" class="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Wyszukiwarka -->
        <div class="relative">
          <div class="relative group">
            <input 
              v-model="searchQuery"
              @keyup.enter="searchParcel"
              type="text" 
              placeholder="Szukaj działki (np. Dobra 1817/1)"
              class="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-portalAccent/20 focus:ring-4 focus:ring-red-50/50 outline-none transition-all text-sm font-medium text-slate-700"
            />
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-portalAccent transition-colors"></i>
          </div>

          <!-- Wyniki -->
          <Transition name="fade">
            <div v-if="searchResults.length > 0" class="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[350px] overflow-y-auto p-2 space-y-1">
              <button 
                v-for="result in searchResults" 
                :key="result.id"
                @click="selectParcel(result)"
                class="w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl transition-all group flex items-center gap-3"
              >
                  <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-portalAccent group-hover:text-white transition-all">
                    <i class="pi pi-map-marker text-xs"></i>
                  </div>
                  <div>
                    <div class="font-bold text-slate-800 text-xs">Działka {{ result.name }}</div>
                    <div class="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{{ result.id }}</div>
                  </div>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Lista Działek -->
      <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <Transition name="fade" mode="out-in">
          <!-- Wybrana działka -->
          <div v-if="selectedParcel" class="p-5">
            <div class="bg-slate-900 rounded-[2rem] p-6 text-white mb-6 shadow-xl shadow-slate-200">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <span class="text-[9px] font-black text-portalAccent uppercase tracking-[0.3em]">Wybrano z mapy</span>
                  <h3 class="text-2xl font-black leading-none mt-1">dz. {{ selectedParcel.name }}</h3>
                </div>
                <button @click="clearSelection" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-portalAccent flex items-center justify-center transition-all">
                  <i class="pi pi-times text-xs"></i>
                </button>
              </div>
              
              <div class="bg-white/5 rounded-xl p-3 border border-white/10 mb-2">
                  <div class="text-[9px] uppercase font-bold text-white/40 mb-1">Pełny identyfikator TERYT</div>
                  <div class="text-[11px] font-mono break-all opacity-90">{{ selectedParcel.id }}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-6">
                <button class="flex items-center gap-3 p-4 bg-slate-50 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                    <i class="pi pi-info-circle text-slate-400 group-hover:text-portalAccent"></i>
                    <span class="text-[10px] font-black uppercase text-slate-600">Info</span>
                </button>
                <button class="flex items-center gap-3 p-4 bg-slate-50 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                    <i class="pi pi-external-link text-slate-400 group-hover:text-portalAccent"></i>
                    <span class="text-[10px] font-black uppercase text-slate-600">Geoportal</span>
                </button>
            </div>
          </div>

          <!-- Lista domyślna -->
          <div v-else class="p-2">
            <div class="px-4 py-3 flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Zasoby Gminy ({{ allParcels.length }})</span>
            </div>
            
            <div class="space-y-1">
              <button 
                v-for="p in allParcels.slice(0, 15)" 
                :key="p.lp"
                @click="selectParcel({ id: p.obreb + ' ' + p.numerDzialki, name: p.numerDzialki, wkt: p.wkt })"
                class="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all group flex items-center gap-4"
              >
                <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-red-50 group-hover:text-portalAccent transition-all border border-slate-100/50 group-hover:border-portalAccent/10">
                  <i class="pi pi-building text-sm"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[11px] font-black text-slate-800 truncate">{{ p.obreb }}</div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Działka {{ p.numerDzialki }}</div>
                </div>
                <i class="pi pi-chevron-right text-[10px] text-slate-200 group-hover:text-portalAccent group-hover:translate-x-1 transition-all"></i>
              </button>
            </div>
            
            <div v-if="allParcels.length > 15" class="mt-4 p-6 bg-slate-50 rounded-[2rem] text-center mx-2">
                <i class="pi pi-search text-slate-300 mb-2 block"></i>
                <p class="text-[10px] text-slate-400 font-medium leading-relaxed px-4">
                    To jest tylko podgląd. Skorzystaj z wyszukiwarki powyżej, aby przeszukać wszystkie <b>{{ allParcels.length }}</b> pozycji.
                </p>
            </div>
          </div>
        </Transition>
      </div>

      <div class="p-5 border-t border-slate-50 bg-slate-50/30 text-center">
        <p class="text-[9px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
          Urząd Miejski w Dobrej
        </p>
      </div>
    </aside>

    <!-- Toggle Button -->
    <button 
      @click="toggleSidebar" 
      class="hidden md:flex absolute left-[380px] top-1/2 -translate-y-1/2 z-[45] w-6 h-12 bg-white border border-l-0 border-slate-100 rounded-r-xl items-center justify-center text-slate-300 hover:text-portalAccent shadow-sm transition-all duration-500"
      :style="{ transform: isSidebarOpen ? 'translateY(-50%)' : 'translateY(-50%) translateX(-380px)' }"
    >
      <i class="pi text-[10px]" :class="isSidebarOpen ? 'pi-chevron-left' : 'pi-chevron-right'"></i>
    </button>

    <!-- Mapa -->
    <div class="flex-1 relative overflow-hidden">
      <GeoportalMap 
        ref="mapComponent"
        :selectedParcel="selectedParcel"
        :allParcels="allParcels"
        :center="[51.914, 18.614]"
        :zoom="13"
      />
      
      <!-- UI Overlays -->
      <div class="absolute bottom-6 right-20 z-30 flex flex-col items-end gap-3">
          <div class="bg-white px-4 py-2.5 rounded-full shadow-2xl border border-slate-100 flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
              <span class="text-[9px] font-black text-slate-800 uppercase tracking-[0.2em]">Live Data</span>
          </div>
      </div>

      <button 
        v-if="!isSidebarOpen"
        @click="toggleSidebar"
        class="md:hidden absolute top-4 left-4 z-30 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-800 border border-slate-100"
      >
        <i class="pi pi-bars text-lg"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.map-page-container {
  height: calc(100vh - 64px); /* Desktop navbar height */
}

@media (min-width: 1024px) {
  .map-page-container {
    height: calc(100vh - 72px); /* Larger screens navbar height */
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
