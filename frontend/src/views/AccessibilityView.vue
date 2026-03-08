<script setup>
import { onMounted } from "vue";
import { updateMetaTags } from "@/utils/seo";
import heroImage from "@/assets/img/dobra.jpg";

onMounted(() => {
  updateMetaTags(
    'Deklaracja Dostępności - Gmina Dobra', 
    'Deklaracja dostępności cyfrowej Portalu Mienia Komunalnego Gminy Dobra.'
  );
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-24">
    <!-- Header -->
    <section class="relative h-[25vh] md:h-[30vh] flex items-center justify-center text-white overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img :src="heroImage" alt="Deklaracja Dostępności" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-midnight/80"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10 text-center pt-24 md:pt-32 pb-12 md:pb-16">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold font-Rubik mb-4">Deklaracja Dostępności</h1>
        <p class="text-yellowMain uppercase tracking-widest font-bold max-w-2xl mx-auto text-sm md:text-base">
          Dostępność Cyfrowa Serwisu Publicznego
        </p>
        <div class="w-16 h-1 bg-yellowMain mx-auto mt-6 rounded-full"></div>
      </div>
    </section>

    <!-- Content -->
    <div class="container mx-auto px-6 max-w-4xl mt-16">
      <div class="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 prose prose-slate max-w-none">
        <h2 class="text-2xl font-black text-midnight mb-6 font-outfit">Wstęp</h2>
        <p class="text-steel mb-8 leading-relaxed">
            Urząd Miejski w Dobrej zobowiązuje się zapewnić dostępność swojego serwisu internetowego zgodnie z przepisami ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych. Oświadczenie w sprawie dostępności ma zastosowanie do Portalu Mienia Komunalnego Gminy Dobra.
        </p>

        <h2 class="text-2xl font-black text-midnight mb-6 font-outfit">Status pod względem zgodności</h2>
        <p class="text-steel mb-8 leading-relaxed font-bold">
            Strona internetowa jest częściowo zgodna z ustawą z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych z powodu niezgodności lub wyłączeń wymienionych poniżej:
        </p>
        <ul class="list-disc pl-6 text-steel mb-8 space-y-2">
            <li>Niektóre mapy (geoportal) są wyłączone z obowiązku zapewniania dostępności, gdyż służą celom informacyjnym i posiadają alternatywę w postaci wykazu tekstowego.</li>
            <li>Niektóre elementy graficzne mogą nie posiadać pełnych tekstów alternatywnych.</li>
        </ul>

        <h2 class="text-2xl font-black text-midnight mb-6 font-outfit">Data sporządzenia deklaracji</h2>
        <p class="text-steel mb-8 leading-relaxed">
            Deklarację sporządzono dnia: <span class="font-bold">2026-03-01</span>.
            Deklaracja została sporządzona na podstawie samooceny przeprowadzonej przez podmiot publiczny.
        </p>

        <h2 class="text-2xl font-black text-midnight mb-6 font-outfit">Informacje zwrotne i dane kontaktowe</h2>
        <p class="text-steel mb-4 leading-relaxed">
            W przypadku problemów z dostępnością strony internetowej prosimy o kontakt. Osobą kontaktową jest Koordynator ds. Dostępności w Urzędzie Miejskim w Dobrej.
        </p>
        <p class="text-steel mb-8 leading-relaxed">
            E-mail: <span class="font-bold">um@dobra24.pl</span><br>
            Telefon: <span class="font-bold">(63) 279-90-11</span>
        </p>

        <h2 class="text-2xl font-black text-midnight mb-6 font-outfit">Skargi i odwołania</h2>
        <p class="text-steel mb-8 leading-relaxed">
            Każdy ma prawo do wystąpienia z żądaniem zapewnienia dostępności cyfrowej strony internetowej lub jej elementu. Po wyczerpaniu wskazanej wyżej procedury można także złożyć wniosek do Rzecznika Praw Obywatelskich.
        </p>
      </div>
    </div>
  </div>
</template>
