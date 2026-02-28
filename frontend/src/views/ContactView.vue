<script setup>
import { onMounted } from "vue";
import Contact from "@/components/Contact.vue";
import { updateMetaTags } from "@/utils/seo";
import heroImage from "@/assets/img/dobra.jpg";

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
    <section class="relative h-[25vh] md:h-[30vh] flex items-center justify-center text-white overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img :src="heroImage" alt="Kontakt" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-midnight/80"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10 text-center pt-16 md:pt-24 pb-12 md:pb-16">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold font-Rubik mb-4">Kontakt</h1>
        <p class="text-yellowMain uppercase tracking-widest font-bold max-w-2xl mx-auto text-sm md:text-base">
          Urząd Miejski w Dobrej
        </p>
        <div class="w-16 h-1 bg-yellowMain mx-auto mt-6 rounded-full"></div>
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
