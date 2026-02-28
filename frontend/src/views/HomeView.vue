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

    <!-- Quick Navigation Dashboard -->
    <section class="py-20 px-4 bg-white relative">
      <div class="container mx-auto">
        <div class="flex flex-col items-center text-center mb-14 gap-3">
          <span class="text-portalAccent font-black uppercase tracking-[0.3em] text-[10px]" data-aos="fade-down">Kategorie mienia</span>
          <h2 class="text-3xl md:text-5xl font-black text-midnight tracking-tight font-outfit" data-aos="fade-up">
            Przeglądaj według <span class="text-portalAccent">potrzeb</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <router-link 
            v-for="(card, index) in [
              { title: 'Budynki', count: '12', icon: 'pi-building', color: 'bg-red-600', query: 'zabudowana' },
              { title: 'Grunty', count: '84', icon: 'pi-map', color: 'bg-slate-700', query: 'niezabudowana' },
              { title: 'Inwestycje', count: '5', icon: 'pi-chart-line', color: 'bg-red-800', query: 'inwestycyjna' },
              { title: 'Drogowe', count: '156', icon: 'pi-car', color: 'bg-slate-500', query: 'drogowa' }
            ]" 
            :key="index"
            :to="{ name: 'properties', query: { search: card.query } }"
            class="group p-8 bg-slateBg rounded-[1.8rem] border border-transparent hover:border-portalAccent/5 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div :class="[card.color, 'w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-md group-hover:rotate-6 transition-all duration-500']">
              <i :class="['pi', card.icon, 'text-xl']"></i>
            </div>
            <h4 class="text-midnight font-bold text-lg mb-1">{{ card.title }}</h4>
            <p class="text-steel font-bold text-[10px] uppercase tracking-widest opacity-60">{{ card.count }} pozycji</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-20 px-4 bg-slateBg">
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
