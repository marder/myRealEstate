<script setup>
import { onMounted } from "vue";
import Contact from "@/components/Contact.vue";
import { updateMetaTags } from "@/utils/seo";

onMounted(async () => {
  updateMetaTags(
    'Kontakt - Baza Nieruchomości Gminy Dobra', 
    'Skontaktuj się z Urzędem Miejskim w Dobrej w sprawie mienia gminnego.'
  );
});
</script>

<template>
  <div class="bg-white min-h-screen">
    <!-- Page Header -->
    <section class="bg-midnight py-20 md:py-32 text-white text-center relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute -top-10 -right-10 w-64 h-64 bg-portalAccent/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-96 h-96 bg-white/5 rounded-full blur-2xl"></div>
      
      <div class="container mx-auto px-6 relative z-10">
        <h1 class="text-5xl md:text-7xl font-black font-outfit mb-6 tracking-tighter">Kontakt</h1>
        <p class="text-portalAccent uppercase tracking-[0.4em] font-black max-w-2xl mx-auto text-xs md:text-sm">
          Urząd Miejski w Dobrej
        </p>
        <div class="w-20 h-1.5 bg-portalAccent mx-auto mt-10 rounded-full"></div>
      </div>
    </section>

    <!-- Main Contact Component -->
    <Contact />

    <!-- Additional Info Section -->
    <section class="pb-32 bg-white">
      <div class="container mx-auto px-6 max-w-5xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 text-center md:text-left">
          <div class="space-y-6">
            <h3 class="text-2xl font-black text-midnight font-outfit flex items-center justify-center md:justify-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-portalAccent">
                <i class="pi pi-info-circle"></i>
              </div>
              Informacje o mieniu
            </h3>
            <p class="text-steel leading-relaxed font-medium text-lg">
              Wszelkie zapytania dotyczące konkretnych działek z wykazu prosimy kierować do Referatu Gospodarki Nieruchomościami. Prosimy o podawanie numeru działki oraz obrębu w treści wiadomości.
            </p>
          </div>
          <div class="space-y-6">
            <h3 class="text-2xl font-black text-midnight font-outfit flex items-center justify-center md:justify-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-portalAccent">
                <i class="pi pi-map"></i>
              </div>
              Obsługa Interesanta
            </h3>
            <p class="text-steel leading-relaxed font-medium text-lg">
              Biuro obsługi klienta czynne jest w godzinach pracy Urzędu. Zapraszamy do kontaktu osobistego, telefonicznego lub poprzez formularz elektroniczny.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
