<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

const acceptCookies = () => {
  localStorage.setItem('cookieConsent', 'true');
  isVisible.value = false;
};

onMounted(() => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    setTimeout(() => {
      isVisible.value = true;
    }, 1500);
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-400 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div v-if="isVisible" class="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[200]">
      <div class="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 opacity-50"></div>
        
        <div class="flex items-start gap-5">
          <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-portalAccent shrink-0">
            <i class="pi pi-info-circle text-xl"></i>
          </div>
          <div>
            <h3 class="text-lg font-black text-midnight mb-2 font-outfit uppercase tracking-tight">Pliki Cookies</h3>
            <p class="text-steel text-sm leading-relaxed mb-6 font-medium">
              Nasz portal wykorzystuje pliki cookies, aby zapewnić najwyższą jakość usług, w tym poprawne działanie map i statystyk. Korzystając ze strony, wyrażasz zgodę na ich użycie zgodnie z naszą 
              <router-link to="/privacy-policy" class="text-portalAccent font-bold hover:underline">Polityką Prywatności</router-link>.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                @click="acceptCookies"
                class="flex-1 px-8 py-3.5 bg-portalAccent text-white font-black rounded-xl hover:bg-accentHover transition-all shadow-lg shadow-portalAccent/20 uppercase tracking-widest text-[10px]"
              >
                Rozumiem i akceptuję
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
