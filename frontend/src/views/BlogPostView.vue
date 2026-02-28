<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getBlogPostById, UPLOADS_URL } from "@/services/api";

const route = useRoute();
const router = useRouter();
const post = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  const postId = route.params.id;
  post.value = await getBlogPostById(postId);
  isLoading.value = false;
  
  if (!post.value && !isLoading.value) {
    router.push({ name: 'not-found' });
  }
});
</script>

<template>
  <div class="bg-white min-h-screen">
    <div v-if="isLoading" class="flex justify-center items-center py-40">
      <i class="pi pi-spin pi-spinner text-4xl text-navyBlue"></i>
    </div>

    <article v-else-if="post" class="pb-24">
      <!-- Article Header -->
      <section class="bg-navyBlue py-24 text-white relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-64 h-64 bg-yellowMain/10 rounded-full"></div>
        <div class="container mx-auto px-6 relative z-10 text-center">
          <div class="inline-block px-4 py-1 bg-yellowMain text-navyBlue font-bold rounded-full text-xs uppercase mb-6 shadow-lg">
            {{ post.category }}
          </div>
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold font-Rubik max-w-4xl mx-auto leading-tight">
            {{ post.title }}
          </h1>
          <div class="flex items-center justify-center gap-6 mt-8 text-gray-300 text-sm font-bold uppercase tracking-widest">
            <span class="flex items-center gap-2"><i class="pi pi-calendar text-yellowMain"></i> {{ new Date(post.createdAt).toLocaleDateString('pl-PL') }}</span>
            <span class="flex items-center gap-2"><i class="pi pi-user text-yellowMain"></i> {{ post.author }}</span>
          </div>
        </div>
      </section>

      <!-- Featured Image -->
      <div class="container mx-auto px-6 -mt-16 relative z-20">
        <div class="max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white bg-gray-100 h-[300px] md:h-[500px]">
          <img v-if="post.image" :src="UPLOADS_URL + '/' + post.image" :alt="post.title" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center bg-navyBlue/5">
            <i class="pi pi-images text-6xl text-gray-300"></i>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <div class="container mx-auto px-6 mt-16">
        <div class="max-w-3xl mx-auto">
          <!-- TODO: Zastosuj DOMPurify dla pełnego bezpieczeństwa v-html -->
          <div class="prose prose-lg prose-navy max-w-none text-gray-600 leading-relaxed" v-html="post.content">
          </div>
          
          <!-- Navigation Back -->
          <div class="mt-16 pt-12 border-t border-gray-100 flex justify-center">
            <button @click="router.push('/blog')" class="inline-flex items-center gap-3 text-navyBlue font-bold hover:text-yellowMain transition-all group">
              <i class="pi pi-arrow-left group-hover:-translate-x-2 transition-transform"></i>
              Powrót do aktualności
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
/* Basic styling for the content rendered via v-html */
:deep(.prose h2) {
  color: #001f3f; /* navyBlue */
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.875rem;
}
:deep(.prose p) {
  margin-bottom: 1.5rem;
}
:deep(.prose strong) {
  color: #001f3f;
}
:deep(.prose ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
