<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getStats, getPageData } from "@/services/api";
import { updateMetaTags } from "@/utils/seo";
import heroImage from "@/assets/img/dobra.jpg";

const router = useRouter();
const stats = ref(null);
const loading = ref(true);
const searchQuery = ref("");

onMounted(async () => {
  const [statsData, pageData] = await Promise.all([
    getStats(),
    getPageData('home')
  ]);
  
  stats.value = statsData;
  loading.value = false;

  updateMetaTags(
    'Mienie Gminne - Gmina Dobra', 
    'Baza danych nieruchomości i gruntów Gminy Dobra. Sprawdź wykaz mienia komunalnego.'
  );
});

const formatCurrency = (value) => {
  if (!value) return "0 zł";
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(value);
};

const formatArea = (value) => {
  if (!value) return "0 ha";
  const ha = value / 10000;
  return ha.toLocaleString('pl-PL', { maximumFractionDigits: 4 }) + " ha";
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'properties', query: { search: searchQuery.value } });
  }
};
</script>

<template>
    <!-- Hero Section -->
    <section class="relative min-h-[40vh] flex items-center justify-center text-midnight overflow-hidden py-12 md:py-16 px-4 bg-softGreen/30">
      <div class="absolute inset-0 z-0">
        <img :src="heroImage" alt="Hero" class="w-full h-full object-cover opacity-15 scale-105" />
        <div class="absolute inset-0 bg-gradient-to-tr from-white via-white/70 to-portalAccent/5"></div>
      </div>
      
      <div class="container mx-auto relative z-10 text-center pt-2 md:pt-4">
        <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-8" data-aos="fade-down">
          <div class="w-1.5 h-1.5 bg-portalAccent rounded-full shadow-[0_0_8px_rgba(220,38,38,0.5)] animate-pulse"></div>
          <span class="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-steel">Biuletyn Mienia Komunalnego</span>
        </div>
        
        <h1 class="text-4xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight font-outfit text-midnight" data-aos="fade-up">
          Wykaz Mienia <br/> <span class="text-portalAccent">Publicznego</span>
        </h1>
        
        <p class="max-w-xl mx-auto text-base md:text-lg text-steel font-medium leading-relaxed mb-10" data-aos="fade-up" data-aos-delay="100">
          Oficjalna baza danych nieruchomości i gruntów Gminy Dobra. Zapewniamy przejrzysty dostęp do zasobów mienia komunalnego.
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          <form @submit.prevent="handleSearch" class="relative group">
            <div class="relative flex items-center">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Szukaj po obrębie lub numerze działki..." 
                class="w-full px-8 py-5 rounded-2xl bg-white border border-gray-100 text-midnight placeholder-gray-400 focus:outline-none transition-all duration-500 pr-20 text-base shadow-[0_15px_40px_rgba(0,0,0,0.02)]"
              />
              <button type="submit" class="absolute right-3 w-12 h-12 bg-portalAccent text-white rounded-xl flex items-center justify-center hover:bg-accentHover active:scale-95 transition-all shadow-lg shadow-portalAccent/10 group">
                <i class="pi pi-search text-xl font-bold"></i>
              </button>
            </div>
          </form>
          <div class="mt-5 flex flex-wrap justify-center gap-4 text-[11px] font-bold text-steel/60 uppercase tracking-wider">
            <button @click="searchQuery = 'Obręb Dobra'" class="hover:text-portalAccent transition-colors">Obręb Dobra</button>
            <span class="opacity-30">•</span>
            <button @click="searchQuery = '123/4'" class="hover:text-portalAccent transition-colors">Działka 123/4</button>
            <span class="opacity-30">•</span>
            <button @click="searchQuery = 'zabudowana'" class="hover:text-portalAccent transition-colors">Zabudowana</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Dashboard Section -->
    <section class="pb-16 -mt-10 relative z-20 px-4">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Stat Card 1 -->
          <div class="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col gap-6 group hover:border-portalAccent/10 hover:shadow-portalAccent/5 transition-all duration-500" data-aos="fade-up">
            <div class="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-portalAccent transition-all group-hover:scale-110 duration-500 shadow-inner">
              <i class="pi pi-map text-2xl"></i>
            </div>
            <div>
              <p class="text-steel text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">Pozycje w bazie</p>
              <h3 class="text-4xl font-black text-midnight tracking-tighter font-outfit">{{ stats?.totalProperties || 0 }}</h3>
            </div>
          </div>
          
          <!-- Stat Card 2 -->
          <div class="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col gap-6 group hover:border-portalAccent/10 hover:shadow-portalAccent/5 transition-all duration-500" data-aos="fade-up" data-aos-delay="100">
            <div class="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 transition-all group-hover:scale-110 duration-500 shadow-inner">
              <i class="pi pi-chart-pie text-2xl"></i>
            </div>
            <div>
              <p class="text-steel text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">Powierzchnia łączna</p>
              <h3 class="text-4xl font-black text-midnight tracking-tighter font-outfit">{{ formatArea(stats?.totalArea) }}</h3>
            </div>
          </div>

          <!-- Stat Card 3 -->
          <div class="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col gap-6 group hover:border-portalAccent/10 hover:shadow-portalAccent/5 transition-all duration-500" data-aos="fade-up" data-aos-delay="200">
            <div class="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 transition-all group-hover:scale-110 duration-500 shadow-inner">
              <i class="pi pi-wallet text-2xl"></i>
            </div>
            <div>
              <p class="text-steel text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">Wycena szacunkowa</p>
              <h3 class="text-4xl font-black text-midnight tracking-tighter font-outfit">{{ formatCurrency(stats?.totalValue) }}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works / Features Section -->
    <section class="py-24 px-4 bg-white overflow-hidden">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div class="relative" data-aos="fade-right">
            <div class="absolute -top-10 -left-10 w-40 h-40 bg-portalAccent/5 rounded-full blur-3xl"></div>
            <div class="relative z-10 bg-slateBg rounded-[3rem] p-4 md:p-8 shadow-inner border border-white/50">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white p-6 rounded-[2rem] shadow-sm transform hover:-translate-y-2 transition-all duration-500">
                  <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-portalAccent mb-4">
                    <i class="pi pi-search-plus text-xl"></i>
                  </div>
                  <h4 class="text-midnight font-black text-sm uppercase tracking-tight mb-2">Precyzyjne Wyszukiwanie</h4>
                  <p class="text-steel text-[11px] leading-relaxed">Znajdź każdą działkę po jej numerze lub obrębie w kilka sekund.</p>
                </div>
                <div class="bg-white p-6 rounded-[2rem] shadow-sm mt-8 transform hover:-translate-y-2 transition-all duration-500">
                  <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                    <i class="pi pi-map text-xl"></i>
                  </div>
                  <h4 class="text-midnight font-black text-sm uppercase tracking-tight mb-2">Interaktywna Mapa</h4>
                  <p class="text-steel text-[11px] leading-relaxed">Przeglądaj granice działek na podkładzie ortofotomapy GUGiK.</p>
                </div>
                <div class="bg-white p-6 rounded-[2rem] shadow-sm transform hover:-translate-y-2 transition-all duration-500">
                  <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                    <i class="pi pi-file-pdf text-xl"></i>
                  </div>
                  <h4 class="text-midnight font-black text-sm uppercase tracking-tight mb-2">Pełna Dokumentacja</h4>
                  <p class="text-steel text-[11px] leading-relaxed">Dostęp do informacji o użytkach, powierzchni i przeznaczeniu.</p>
                </div>
                <div class="bg-white p-6 rounded-[2rem] shadow-sm mt-8 transform hover:-translate-y-2 transition-all duration-500">
                  <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                    <i class="pi pi-mobile text-xl"></i>
                  </div>
                  <h4 class="text-midnight font-black text-sm uppercase tracking-tight mb-2">Wersja Mobilna</h4>
                  <p class="text-steel text-[11px] leading-relaxed">Portal zoptymalizowany pod kątem smartfonów i tabletów.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div data-aos="fade-left">
            <span class="text-portalAccent font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Nowoczesna Administracja</span>
            <h2 class="text-4xl md:text-5xl font-black text-midnight mb-8 leading-tight font-outfit">Transparentny wgląd w <span class="text-portalAccent">Mienie Komunalne</span></h2>
            <p class="text-steel text-lg mb-10 leading-relaxed font-medium">
              Nasz portal to nie tylko baza danych, to narzędzie wspierające rozwój lokalny. Dzięki integracji z systemami GIS, każdy mieszkaniec ma bezpośredni wgląd w to, jak Gmina zarządza wspólnym majątkiem.
            </p>
            <ul class="space-y-5 mb-12">
              <li class="flex items-center gap-4 group">
                <div class="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-portalAccent group-hover:bg-portalAccent group-hover:text-white transition-all">
                  <i class="pi pi-check text-[10px]"></i>
                </div>
                <span class="text-midnight font-bold text-sm">Aktualne dane z ewidencji gruntów (EGiB)</span>
              </li>
              <li class="flex items-center gap-4 group">
                <div class="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-portalAccent group-hover:bg-portalAccent group-hover:text-white transition-all">
                  <i class="pi pi-check text-[10px]"></i>
                </div>
                <span class="text-midnight font-bold text-sm">Integracja z warstwami Geoportalu Krajowego</span>
              </li>
              <li class="flex items-center gap-4 group">
                <div class="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-portalAccent group-hover:bg-portalAccent group-hover:text-white transition-all">
                  <i class="pi pi-check text-[10px]"></i>
                </div>
                <span class="text-midnight font-bold text-sm">Dostępność informacji 24/7 z dowolnego miejsca</span>
              </li>
            </ul>
            <router-link to="/about" class="inline-flex items-center gap-3 px-10 py-5 bg-midnight text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-midnight/10">
              Dowiedz się więcej o systemie
              <i class="pi pi-arrow-right text-[10px]"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Navigation Dashboard -->
    <section class="py-24 px-4 bg-slateBg relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      <div class="container mx-auto relative z-10">
        <div class="flex flex-col items-center text-center mb-16 gap-3">
          <span class="text-portalAccent font-black uppercase tracking-[0.3em] text-[10px]" data-aos="fade-down">Kategorie według użytków</span>
          <h2 class="text-3xl md:text-5xl font-black text-midnight tracking-tight font-outfit" data-aos="fade-up">
            Przeglądaj według <span class="text-portalAccent">oznaczeń</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <router-link 
            v-for="(card, index) in [
              { title: 'Rolne', label: 'Użytki R, Ps, Ł', icon: 'fa-solid fa-wheat-awn', color: 'bg-amber-500', query: 'R' },
              { title: 'Mieszkaniowe', label: 'Użytki B, Bp', icon: 'pi-home', color: 'bg-red-600', query: 'B' },
              { title: 'Lasy', label: 'Użytki Ls, Lz', icon: 'fa-solid fa-tree', color: 'bg-emerald-700', query: 'Ls' },
              { title: 'Drogi', label: 'Użytki dr, Tp', icon: 'pi-car', color: 'bg-slate-600', query: 'dr' }
            ]" 
            :key="index"
            :to="{ name: 'properties', query: { search: card.query } }"
            class="group p-10 bg-white rounded-[2.5rem] border border-gray-100 hover:border-portalAccent/10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div :class="[card.color, 'w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-12 transition-all duration-500']">
              <i :class="[card.icon.startsWith('fa-') ? card.icon : 'pi ' + card.icon, 'text-2xl']"></i>
            </div>
            <h4 class="text-midnight font-black text-xl mb-2">{{ card.title }}</h4>
            <p class="text-steel font-bold text-[11px] uppercase tracking-widest opacity-60">{{ card.label }}</p>
            <div class="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <span class="text-[10px] font-black uppercase text-portalAccent">Zobacz listę</span>
              <i class="pi pi-chevron-right text-[10px] text-portalAccent transform group-hover:translate-x-1 transition-transform"></i>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Map CTA Section -->
    <section class="py-24 px-4 bg-white">
      <div class="container mx-auto">
        <div class="bg-midnight rounded-[3rem] p-10 md:p-16 relative overflow-hidden text-white group">
          <div class="absolute top-0 right-0 w-1/2 h-full bg-portalAccent/10 skew-x-12 transform translate-x-1/2"></div>
          <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
          
          <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div class="max-w-2xl text-center lg:text-left">
              <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
                <i class="pi pi-map-marker text-portalAccent"></i>
                <span class="text-[10px] font-black uppercase tracking-widest">Wizualizacja przestrzenna</span>
              </div>
              <h2 class="text-4xl md:text-5xl font-black mb-8 font-outfit leading-tight">Przeglądaj zasoby na <br/> <span class="text-portalAccent">interaktywnej mapie</span></h2>
              <p class="text-white/70 text-lg mb-10 leading-relaxed font-medium">
                Skorzystaj z nowoczesnego modułu mapy, aby zobaczyć dokładne położenie i granice działek gminnych. Integrujemy dane z Krajowej Infrastruktury Informacji Przestrzennej.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <router-link to="/map" class="px-10 py-5 bg-portalAccent text-white font-black rounded-2xl hover:bg-accentHover transition-all shadow-xl shadow-portalAccent/20 uppercase tracking-widest text-[10px] text-center">
                  Otwórz mapę geoportalu
                </router-link>
                <router-link to="/properties" class="px-10 py-5 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all border border-white/10 uppercase tracking-widest text-[10px] text-center">
                  Wykaz tabelaryczny
                </router-link>
              </div>
            </div>
            
            <div class="relative w-full lg:w-1/3 aspect-square max-w-sm" data-aos="zoom-in">
              <div class="absolute inset-0 bg-white/5 rounded-[2.5rem] rotate-6 border border-white/10"></div>
              <div class="absolute inset-0 bg-portalAccent/20 rounded-[2.5rem] -rotate-3 border border-white/10 shadow-2xl flex items-center justify-center">
                 <i class="pi pi-map-marker text-7xl text-white animate-bounce"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-24 px-4 bg-slateBg relative overflow-hidden">
      <div class="container mx-auto">
        <div class="bg-white rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50">
          <div class="absolute -top-24 -right-24 w-80 h-80 bg-portalAccent/5 rounded-full blur-[80px]"></div>
          
          <div class="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <h2 class="text-3xl md:text-5xl font-black text-midnight mb-6 leading-tight font-outfit">Oficjalny Portal <span class="text-portalAccent">Gminy Dobra</span></h2>
            <p class="text-steel text-base md:text-lg font-medium leading-relaxed mb-10">
              Gmina Dobra to dynamicznie rozwijający się region w województwie wielkopolskim. Nasz portal mienia komunalnego to element strategii "Inwestuj w Dobrej", mającej na celu zapewnienie przejrzystości i wsparcia dla mieszkańców oraz przyszłych inwestorów.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <router-link to="/contact" class="px-12 py-5 bg-portalAccent text-white font-black rounded-xl hover:bg-accentHover transition-all shadow-lg shadow-portalAccent/10 uppercase tracking-widest text-[11px] text-center">
                Skontaktuj się z urzędem
              </router-link>
              <a href="https://www.dobra24.pl" target="_blank" class="px-12 py-5 bg-white text-midnight font-black rounded-xl border border-gray-100 hover:bg-gray-50 transition-all uppercase tracking-widest text-[11px] text-center">
                Odwiedź dobra24.pl
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>
