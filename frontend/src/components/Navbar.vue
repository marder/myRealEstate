<script setup>
import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";

const route = useRoute();
const isMenuOpen = ref(false);
const isScrolled = ref(false);

const navLinks = [
  { path: '/', label: 'Strona Główna', icon: 'pi-home' },
  { path: '/properties', label: 'Wykaz Mienia', icon: 'pi-building' },
  { path: '/map', label: 'Mapa', icon: 'pi-map' },
  { path: '/about', label: 'O nas', icon: 'pi-info-circle' },
  { path: '/contact', label: 'Kontakt', icon: 'pi-envelope' }
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

const isActiveLink = (routePath) => {
  if (routePath === '/') return route.path === '/';
  return route.path.startsWith(routePath);
};

const isMapPage = computed(() => route.path === '/map');

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.body.style.overflow = '';
});
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-[100] transition-all duration-500">
    <!-- Top Contact Bar - Hidden on map page to maximize space -->
    <div 
      v-if="!isMapPage"
      class="bg-white border-b border-gray-50 text-steel text-[12px] transition-all duration-500 overflow-hidden hidden md:block"
      :class="isScrolled ? 'h-0 opacity-0' : 'h-11 opacity-100'"
    >
      <div class="container mx-auto px-10 h-full flex justify-between items-center font-bold uppercase tracking-wider">
        <div class="flex space-x-8 items-center">
          <div class="flex items-center gap-2.5">
            <i class="pi pi-map-marker text-portalAccent"></i>
            <span>Pl. Wojska Polskiego 10, 62-730 Dobra</span>
          </div>
          <div class="flex items-center gap-2.5 border-l pl-8 border-gray-100">
            <i class="pi pi-envelope text-portalAccent"></i>
            <span class="lowercase">um@dobra24.pl</span>
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <i class="pi pi-phone text-portalAccent font-bold"></i>
          <span>(63) 279-90-11</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav 
      class="w-full transition-all duration-500"
      :class="[
        (isScrolled || isMapPage) ? 'bg-white/90 backdrop-blur-xl py-3 shadow-[0_10px_40px_rgba(0,0,0,0.04)]' : 'bg-white py-6',
        isMapPage ? 'border-b border-slate-100' : ''
      ]"
    >
      <div class="container mx-auto px-6 md:px-10">
        <div class="flex items-center justify-between">
          <!-- Logo Section -->
          <RouterLink to="/" class="flex items-center gap-4 group" @click="closeMenu">
            <div class="relative overflow-hidden w-10 h-10 md:w-12 md:h-12 p-1.5 bg-white rounded-xl border border-gray-50 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:-translate-y-0.5">
              <img src="@/assets/logo.png" alt="Herb Gminy Dobra" class="w-full h-full object-contain" />
            </div>
            <div class="leading-tight border-l-2 pl-4 border-gray-100">
              <span class="block font-black text-midnight text-base lg:text-xl leading-none mb-0.5 uppercase tracking-tighter font-outfit">Gmina Dobra</span>
              <span class="hidden lg:block text-[9px] text-portalAccent uppercase tracking-[0.2em] font-black">Mienie Komunalne</span>
            </div>
          </RouterLink>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-0.5 lg:space-x-1">
            <RouterLink 
              v-for="link in navLinks" 
              :key="link.path"
              :to="link.path"
              class="relative px-4 lg:px-5 py-2.5 font-outfit font-extrabold uppercase text-[10px] lg:text-[12px] tracking-[0.1em] transition-all duration-300 rounded-xl group"
              :class="isActiveLink(link.path) ? 'text-portalAccent bg-red-50' : 'text-steel hover:text-midnight hover:bg-gray-50'"
            >
              {{ link.label }}
            </RouterLink>
          </div>
          
          <!-- Hamburger Icon -->
          <button 
            @click="toggleMenu"
            class="block md:hidden focus:outline-none z-[110] relative w-10 h-10 bg-gray-50 rounded-xl"
            :class="{ 'open': isMenuOpen }"
          >
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <span class="w-5 h-0.5 bg-midnight rounded-full transition-all duration-300" :class="{ 'rotate-45 translate-y-2 w-6': isMenuOpen }"></span>
              <span class="w-5 h-0.5 bg-midnight rounded-full transition-all duration-300" :class="{ 'opacity-0': isMenuOpen }"></span>
              <span class="w-5 h-0.5 bg-midnight rounded-full transition-all duration-300" :class="{ '-rotate-45 -translate-y-2 w-6': isMenuOpen }"></span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div class="md:hidden">
      <div 
        v-if="isMenuOpen" 
        @click="closeMenu"
        class="fixed inset-0 bg-midnight/20 backdrop-blur-md z-[105] transition-opacity duration-500"
      ></div>

      <Transition
        enter-active-class="transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition duration-400 cubic-bezier(0.4, 0, 0.2, 1)"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <div 
          v-if="isMenuOpen"
          class="fixed top-0 right-0 h-dvh w-[85%] max-w-sm bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.05)] z-[108] p-10 flex flex-col pt-24"
        >
          <div class="flex flex-col space-y-4">
            <span class="text-[10px] text-portalAccent font-black uppercase tracking-[0.4em] mb-4 text-center">Nawigacja</span>
            <RouterLink 
              v-for="link in navLinks" 
              :key="link.path"
              :to="link.path" 
              @click="closeMenu" 
              class="font-outfit font-black uppercase tracking-wider flex items-center gap-5 p-5 rounded-[1.5rem] transition-all"
              :class="isActiveLink(link.path) ? 'bg-red-50 text-portalAccent' : 'text-midnight hover:bg-gray-50'"
            >
              <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <i :class="['pi', link.icon, 'text-xl', isActiveLink(link.path) ? 'text-portalAccent' : 'text-gray-400']"></i>
              </div>
              {{ link.label }}
            </RouterLink>
          </div>

          <div class="mt-auto pt-10 border-t border-gray-100">
             <div class="flex items-center gap-4 text-steel">
                <i class="pi pi-phone text-portalAccent"></i>
                <span class="font-bold text-midnight">(63) 279-90-12</span>
             </div>
          </div>
        </div>
      </Transition>
    </div>
  </header>
  
  <!-- Unified Dynamic Spacer -->
  <div :class="[
    isMapPage ? 'h-[64px] lg:h-[72px]' : (isScrolled ? 'h-[72px] md:h-[72px]' : 'h-[72px] md:h-[136px]')
  ]"></div>
</template>

<style scoped>
.open .hamburger-top {
  top: 14px;
  transform: rotate(135deg);
}
.open .hamburger-middle {
  opacity: 0;
  left: -60px;
}
.open .hamburger-bottom {
  top: 14px;
  transform: rotate(-135deg);
}
</style>
