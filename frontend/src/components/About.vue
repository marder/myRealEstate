<script setup>
import { ref, onMounted } from "vue";
import photo from "@/assets/img/dobra.jpg";
import { RouterLink } from "vue-router";
import { getFrontpageData } from "@/services/api";

const aboutHeader = ref("Profesjonalne podejście do nieruchomości");
const aboutContent = ref("Junkiert Investment to marka łącząca wieloletnie doświadczenie w geodezji z nowoczesnym podejściem do obrotu nieruchomościami. Pomagamy naszym klientom bezpiecznie inwestować i zarządzać ich gruntami.");
const experienceYears = ref(14);

onMounted(async () => {
  const data = await getFrontpageData();
  if (data && data.about) {
    aboutHeader.value = data.about.header || aboutHeader.value;
    aboutContent.value = data.about.content || aboutContent.value;
    experienceYears.value = data.about.experienceYears || experienceYears.value;
  }
});
</script>

<template>
  <section id="about-summary" class="py-20 bg-white overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="flex flex-col lg:flex-row items-center gap-16">
        <!-- Image Side -->
        <div class="lg:w-1/2 relative">
          <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-yellowMain/10 rounded-full -z-0"></div>
          <div class="relative z-10">
            <img :src="photo" alt="O nas" class="rounded-3xl shadow-2xl border-[12px] border-white object-cover aspect-video md:aspect-square" />
            <!-- Experience Badge -->
            <div class="absolute -bottom-6 -right-6 bg-navyBlue text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <span class="block text-3xl font-bold text-yellowMain">{{ experienceYears }}+</span>
              <span class="text-xs uppercase tracking-wider font-medium">Lat doświadczenia</span>
            </div>
          </div>
        </div>

        <!-- Text Side -->
        <div class="lg:w-1/2 space-y-8">
          <div class="space-y-4">
            <h3 class="text-yellowMain font-bold uppercase tracking-widest text-sm">Poznaj naszą historię</h3>
            <h2 class="text-navyBlue text-4xl md:text-5xl font-bold font-Rubik leading-tight">
              {{ aboutHeader }}
            </h2>
            <div class="w-20 h-1.5 bg-yellowMain rounded-full"></div>
          </div>

          <div class="space-y-4 text-gray-600 leading-relaxed text-lg whitespace-pre-line">
            <p>
              {{ aboutContent }}
            </p>
          </div>

          <div class="pt-4">
            <RouterLink to="/about" class="inline-flex items-center gap-3 bg-navyBlue text-white px-8 py-4 rounded-full font-bold hover:bg-yellowMain hover:text-navyBlue transition-all duration-300 shadow-lg group">
              Poznaj nasz zespół
              <i class="pi pi-users group-hover:scale-110 transition-transform"></i>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
