<script setup>
import { onMounted } from "vue";
import { updateMetaTags } from "@/utils/seo";
import heroImage from "@/assets/img/dobra.jpg";

onMounted(() => {
  updateMetaTags(
    'Polityka Prywatności - Gmina Dobra', 
    'Informacje o przetwarzaniu danych osobowych w Portalu Mienia Komunalnego Gminy Dobra.'
  );
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-24">
    <!-- Header -->
    <section class="relative h-[25vh] md:h-[30vh] flex items-center justify-center text-white overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img :src="heroImage" alt="Polityka Prywatności" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-midnight/80"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10 text-center pt-24 md:pt-32 pb-12 md:pb-16">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold font-Rubik mb-4">Polityka Prywatności</h1>
        <p class="text-yellowMain uppercase tracking-widest font-bold max-w-2xl mx-auto text-sm md:text-base">
          Ochrona Danych Osobowych (RODO)
        </p>
        <div class="w-16 h-1 bg-yellowMain mx-auto mt-6 rounded-full"></div>
      </div>
    </section>

    <!-- Content -->
    <div class="container mx-auto px-6 max-w-4xl mt-16">
      <div class="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 prose prose-slate max-w-none">
        <h2 class="text-2xl font-black text-midnight mb-6">1. Administrator Danych</h2>
        <p class="text-steel mb-8 leading-relaxed">
          Administratorem Twoich danych osobowych jest Burmistrz Dobrej z siedzibą w Urzędzie Miejskim w Dobrej, Pl. Wojska Polskiego 10, 62-730 Dobra.
        </p>

        <h2 class="text-2xl font-black text-midnight mb-6">2. Cele przetwarzania danych</h2>
        <p class="text-steel mb-4 leading-relaxed">Dane przetwarzane są w celu:</p>
        <ul class="list-disc pl-6 text-steel mb-8 space-y-2">
          <li>Umożliwienia korzystania z funkcjonalności Portalu Mienia Komunalnego.</li>
          <li>Udzielania odpowiedzi na zapytania przesłane drogą elektroniczną.</li>
          <li>Realizacji zadań ustawowych Gminy Dobra w zakresie gospodarki nieruchomościami.</li>
          <li>Analizy statystycznej ruchu w serwisie w celu poprawy jego jakości.</li>
        </ul>

        <h2 class="text-2xl font-black text-midnight mb-6">3. Podstawa prawna</h2>
        <p class="text-steel mb-8 leading-relaxed">
          Przetwarzanie odbywa się zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO) oraz ustawą o ochronie danych osobowych.
        </p>

        <h2 class="text-2xl font-black text-midnight mb-6">4. Pliki Cookies</h2>
        <p class="text-steel mb-8 leading-relaxed">
          Portal wykorzystuje pliki cookies (ciasteczka) w celach technicznych (sesyjnych) oraz analitycznych. Użytkownik może w każdej chwili zmienić ustawienia dotyczące plików cookies w swojej przeglądarce. Wyłączenie plików cookies może wpłynąć na poprawne działanie niektórych funkcji serwisu (np. zapamiętywanie ustawień mapy).
        </p>

        <h2 class="text-2xl font-black text-midnight mb-6">5. Twoje prawa</h2>
        <p class="text-steel mb-4 leading-relaxed">Masz prawo do:</p>
        <ul class="list-disc pl-6 text-steel mb-8 space-y-2">
          <li>Dostępu do swoich danych oraz otrzymania ich kopii.</li>
          <li>Sprostowania (poprawiania) swoich danych.</li>
          <li>Usunięcia danych lub ograniczenia ich przetwarzania.</li>
          <li>Wniesienia sprzeciwu wobec przetwarzania.</li>
          <li>Wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</li>
        </ul>

        <h2 class="text-2xl font-black text-midnight mb-6">6. Kontakt</h2>
        <p class="text-steel leading-relaxed">
          W sprawach dotyczących ochrony danych osobowych można kontaktować się z Inspektorem Ochrony Danych pod adresem e-mail: <span class="font-bold">iod@dobra24.pl</span> lub listownie na adres Urzędu.
        </p>
      </div>
    </div>
  </div>
</template>
