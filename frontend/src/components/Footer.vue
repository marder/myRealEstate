<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <footer class="bg-white text-midnight pt-24 pb-12 overflow-hidden relative border-t border-gray-50">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-portalAccent/20 to-transparent"></div>
    
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <!-- Section 1: Brand/Logo -->
        <div class="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
          <RouterLink to="/" class="flex items-center gap-5 mb-8 group">
            <div class="w-16 h-16 p-2.5 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-50 transition-all duration-500 group-hover:-translate-y-1">
              <img src="@/assets/logo.png" alt="Herb Gminy Dobra" class="w-full h-full object-contain" />
            </div>
            <div class="text-left">
              <h2 class="text-2xl font-black tracking-tighter text-midnight uppercase leading-none mb-1 font-outfit">Gmina Dobra</h2>
              <p class="text-[10px] text-portalAccent font-black uppercase tracking-[0.3em]">Baza Nieruchomości</p>
            </div>
          </RouterLink>
          <p class="text-steel text-lg font-medium max-w-md leading-relaxed">
            Oficjalny portal informacyjny o mieniu komunalnym Gminy Dobra. Zapewniamy pełną transparentność w zarządzaniu zasobami gminnymi.
          </p>
          <div class="flex gap-4 mt-10">
            <a href="#" class="w-12 h-12 rounded-2xl bg-slateBg flex items-center justify-center text-steel hover:bg-portalAccent hover:text-white transition-all duration-500 shadow-sm">
              <i class="pi pi-facebook text-xl"></i>
            </a>
            <a href="#" class="w-12 h-12 rounded-2xl bg-slateBg flex items-center justify-center text-steel hover:bg-portalAccent hover:text-white transition-all duration-500 shadow-sm">
              <i class="pi pi-globe text-xl"></i>
            </a>
          </div>
        </div>

        <!-- Section 2: Quick Links -->
        <div class="flex flex-col items-center md:items-start">
          <h3 class="text-midnight font-black uppercase tracking-[0.2em] text-[11px] mb-10 opacity-50">Nawigacja</h3>
          <ul class="space-y-5 text-center md:text-left">
            <li v-for="link in [
              { path: '/', label: 'Strona Główna' },
              { path: '/offer', label: 'Wykaz Mienia' },
              { path: '/contact', label: 'Kontakt' }
            ]" :key="link.path">
              <RouterLink :to="link.path" class="text-steel hover:text-portalAccent font-bold transition-all duration-300 flex items-center gap-3 group">
                <span class="w-0 h-0.5 bg-portalAccent group-hover:w-4 transition-all duration-300"></span>
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Section 3: Contact Info -->
        <div class="flex flex-col items-center md:items-start">
          <h3 class="text-midnight font-black uppercase tracking-[0.2em] text-[11px] mb-10 opacity-50">Kontakt i Godziny</h3>
          <ul class="space-y-6 text-center md:text-left">
            <li class="flex flex-col md:flex-row items-center md:items-start gap-5">
              <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-portalAccent shrink-0 shadow-inner">
                <i class="pi pi-map-marker text-xl"></i>
              </div>
              <span class="text-steel font-bold text-sm leading-relaxed text-left">Pl. Wojska Polskiego 10, <br/> 62-730 Dobra</span>
            </li>
            <li class="flex flex-col md:flex-row items-center md:items-start gap-5">
              <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-portalAccent shrink-0 shadow-inner">
                <i class="pi pi-phone text-xl"></i>
              </div>
              <div class="text-left">
                <p class="text-steel font-bold text-sm">(63) 279-90-11</p>
                <div class="text-[10px] text-steel/50 font-black uppercase tracking-widest mt-1 space-y-0.5">
                  <p>Pon: 07:30 – 16:30</p>
                  <p>Wt-Czw: 07:30 – 15:30</p>
                  <p>Pt: 07:30 – 14:30</p>
                </div>
              </div>
            </li>
            <li class="flex flex-col md:flex-row items-center md:items-start gap-5">
              <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-portalAccent shrink-0 shadow-inner">
                <i class="pi pi-envelope text-xl"></i>
              </div>
              <span class="text-steel font-bold text-sm lowercase">um@dobra24.pl</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
        <p class="text-steel/40 text-[10px] font-black uppercase tracking-[0.2em]">&copy; {{ new Date().getFullYear() }} Urząd Miejski w Dobrej</p>
        <div class="flex gap-10">
          <a href="#" class="text-steel/40 hover:text-midnight text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Polityka Prywatności</a>
          <a href="#" class="text-steel/40 hover:text-midnight text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Deklaracja Dostępności</a>
        </div>
      </div>
    </div>
  </footer>
</template>
