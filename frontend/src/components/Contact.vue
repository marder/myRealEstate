<script setup>
import { ref, onMounted } from "vue";
import { getFrontpageData } from "@/services/api";

const address = ref("Pl. Wojska Polskiego 10\n62-730 Dobra");
const phone = ref("(63) 279-90-11");
const email = ref("um@dobra24.pl");
const workingHours = ref("Pon: 07:30 – 16:30 | Wt-Czw: 07:30 – 15:30 | Pt: 07:30 – 14:30");
const mapEmbed = ref("https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d19687.309910670985!2d18.612908949999998!3d51.9172849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spl!2spl!4v1772192098376!5m2!1spl!2spl");

// Form State
const formData = ref({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
});
const loading = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

const submitForm = async () => {
  loading.value = true;
  successMsg.value = "";
  errorMsg.value = "";
  
  try {
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value)
    });
    
    const result = await response.json();
    if (response.ok && result.success) {
      successMsg.value = result.message;
      formData.value = { name: "", email: "", phone: "", subject: "", message: "" };
    } else {
      errorMsg.value = result.message || "Wystąpił błąd podczas wysyłania wiadomości.";
    }
  } catch (err) {
    errorMsg.value = "Nie udało się połączyć z serwerem. Spróbuj ponownie później.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const data = await getFrontpageData();
  if (data && data.contact) {
    address.value = data.contact.address || address.value;
    phone.value = data.contact.phone || phone.value;
    email.value = data.contact.email || email.value;
    workingHours.value = data.contact.workingHours || workingHours.value;
    mapEmbed.value = data.contact.googleMapsEmbed || mapEmbed.value;
  }
});
</script>

<template>
  <section id="contact" class="bg-white py-12 md:py-24">
    <div class="container mx-auto px-4 md:px-6">
      <div class="bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-50">
        <div class="flex flex-col lg:flex-row">
          
          <!-- Left Side: Content & Form -->
          <div class="lg:w-7/12 flex flex-col">
            <!-- Contact Info Top -->
            <div class="px-8 py-12 md:p-16 lg:p-20 bg-midnight text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-portalAccent/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              
              <h2 class="text-portalAccent font-black uppercase tracking-[0.3em] text-[10px] mb-6 relative z-10">Kontakt Bezpośredni</h2>
              <h1 class="text-3xl md:text-6xl font-black font-outfit mb-12 relative z-10 tracking-tight leading-none">Zapytaj o <br/> <span class="text-portalAccent">Nieruchomość</span></h1>
              
              <div class="space-y-10 relative z-10">
                <!-- Address -->
                <div class="flex items-start gap-6 group">
                  <div class="w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 flex justify-center items-center group-hover:bg-portalAccent transition-all duration-500 border border-white/10 shadow-inner">
                    <i class="pi pi-map-marker text-xl text-portalAccent group-hover:text-white"></i>
                  </div>
                  <div>
                    <h3 class="text-white/40 font-black text-[10px] mb-2 uppercase tracking-[0.2em]">Urząd Miejski w Dobrej</h3>
                    <p class="text-gray-100 text-lg font-bold leading-snug whitespace-pre-line">{{ address }}</p>
                  </div>
                </div>

                <!-- Phone -->
                <div class="flex items-start gap-6 group">
                  <div class="w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 flex justify-center items-center group-hover:bg-portalAccent transition-all duration-500 border border-white/10 shadow-inner">
                    <i class="pi pi-phone text-xl text-portalAccent group-hover:text-white"></i>
                  </div>
                  <div>
                    <h3 class="text-white/40 font-black text-[10px] mb-2 uppercase tracking-[0.2em]">Telefon do urzędu</h3>
                    <a :href="'tel:' + phone" class="text-2xl md:text-4xl font-black hover:text-portalAccent transition-colors font-outfit tracking-tighter">
                      {{ phone }}
                    </a>
                  </div>
                </div>

                <!-- Email -->
                <div class="flex items-start gap-6 group">
                  <div class="w-14 h-14 bg-white/5 rounded-2xl flex-shrink-0 flex justify-center items-center group-hover:bg-portalAccent transition-all duration-500 border border-white/10 shadow-inner">
                    <i class="pi pi-envelope text-xl text-portalAccent group-hover:text-white"></i>
                  </div>
                  <div>
                    <h3 class="text-white/40 font-black text-[10px] mb-2 uppercase tracking-[0.2em]">Adres E-mail</h3>
                    <a :href="'mailto:' + email" class="text-lg md:text-xl font-bold hover:text-portalAccent transition-colors break-all">
                      {{ email }}
                    </a>
                  </div>
                </div>
              </div>

              <!-- Working Hours -->
              <div class="mt-16 pt-10 border-t border-white/10 flex flex-col gap-4 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                <div class="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-xl border border-white/5 shadow-inner w-fit">
                  <i class="pi pi-calendar-clock text-portalAccent"></i>
                  <span>Godziny urzędowania:</span>
                </div>
                <div v-if="workingHours.includes('|')" class="grid grid-cols-1 gap-2 ml-2">
                  <div class="flex justify-between border-b border-white/5 pb-1"><span>Poniedziałek:</span> <span class="text-white">07:30 – 16:30</span></div>
                  <div class="flex justify-between border-b border-white/5 pb-1"><span>Wtorek - Czwartek:</span> <span class="text-white">07:30 – 15:30</span></div>
                  <div class="flex justify-between"><span>Piątek:</span> <span class="text-white">07:30 – 14:30</span></div>
                </div>
                <div v-else class="text-white text-xs ml-2">
                  {{ workingHours }}
                </div>
              </div>
            </div>

            <!-- Form Bottom -->
            <div class="p-8 md:p-16 lg:p-20 bg-white flex-grow">
              <div class="max-w-xl">
                <h3 class="text-2xl md:text-3xl font-black text-midnight font-outfit mb-10 tracking-tight">Wyślij wiadomość do <span class="text-portalAccent">Referatu</span></h3>
                
                <form @submit.prevent="submitForm" class="space-y-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="space-y-1">
                      <label class="text-[10px] font-black uppercase tracking-widest text-steel/60 ml-1">Twoje Dane</label>
                      <input v-model="formData.name" type="text" placeholder="Imię i nazwisko" required
                        class="w-full px-5 py-4 rounded-xl bg-slateBg border border-gray-100 focus:border-portalAccent/30 focus:bg-white focus:outline-none transition-all text-sm font-bold placeholder-gray-400">
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] font-black uppercase tracking-widest text-steel/60 ml-1">Adres E-mail</label>
                      <input v-model="formData.email" type="email" placeholder="email@przyklad.pl" required
                        class="w-full px-5 py-4 rounded-xl bg-slateBg border border-gray-100 focus:border-portalAccent/30 focus:bg-white focus:outline-none transition-all text-sm font-bold placeholder-gray-400">
                    </div>
                  </div>
                  
                  <div class="space-y-1">
                    <label class="text-[10px] font-black uppercase tracking-widest text-steel/60 ml-1">Nr Telefonu (Opcjonalnie)</label>
                    <input v-model="formData.phone" type="text" placeholder="+48 000 000 000"
                      class="w-full px-5 py-4 rounded-xl bg-slateBg border border-gray-100 focus:border-portalAccent/30 focus:bg-white focus:outline-none transition-all text-sm font-bold placeholder-gray-400">
                  </div>
                  
                  <div class="space-y-1">
                    <label class="text-[10px] font-black uppercase tracking-widest text-steel/60 ml-1">Temat wiadomości</label>
                    <input v-model="formData.subject" type="text" placeholder="Np. Zapytanie o działkę 123/4" required
                      class="w-full px-5 py-4 rounded-xl bg-slateBg border border-gray-100 focus:border-portalAccent/30 focus:bg-white focus:outline-none transition-all text-sm font-bold placeholder-gray-400">
                  </div>
                  
                  <div class="space-y-1">
                    <label class="text-[10px] font-black uppercase tracking-widest text-steel/60 ml-1">Twoje pytanie</label>
                    <textarea v-model="formData.message" placeholder="Treść wiadomości..." rows="5" required
                      class="w-full px-5 py-4 rounded-xl bg-slateBg border border-gray-100 focus:border-portalAccent/30 focus:bg-white focus:outline-none transition-all text-sm font-bold placeholder-gray-400"></textarea>
                  </div>
                  
                  <button type="submit" :disabled="loading"
                    class="w-full mt-4 bg-portalAccent text-white font-black py-5 rounded-xl hover:bg-accentHover hover:shadow-xl hover:shadow-portalAccent/20 transform transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs">
                    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                    {{ loading ? 'Przesyłanie...' : 'Wyślij zapytanie' }}
                  </button>

                  <!-- Success/Error Feedback -->
                  <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
                    <div v-if="successMsg" class="mt-6 p-5 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold border border-emerald-100 flex items-center gap-3 shadow-sm">
                      <i class="pi pi-check-circle text-lg"></i> {{ successMsg }}
                    </div>
                  </Transition>
                  <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
                    <div v-if="errorMsg" class="mt-6 p-5 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 shadow-sm">
                      <i class="pi pi-exclamation-triangle text-lg"></i> {{ errorMsg }}
                    </div>
                  </Transition>
                </form>
              </div>
            </div>
          </div>

          <!-- Right Side: Full Height Map -->
          <div class="lg:w-5/12 min-h-[500px] lg:min-h-full relative overflow-hidden">
             <div class="absolute inset-0 bg-slateBg animate-pulse z-0"></div>
             <iframe
              :src="mapEmbed"
              width="100%" height="100%" style="border: 0" allowfullscreen="" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="absolute inset-0 grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-1000 z-10"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ensure the map covers the container */
iframe {
  filter: grayscale(1);
  transition: filter 0.5s ease;
}
iframe:hover {
  filter: grayscale(0);
}
</style>