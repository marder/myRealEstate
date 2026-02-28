<script setup>
import { ref, onMounted } from "vue";
import { getBlogPosts, UPLOADS_URL } from "@/services/api";
import { RouterLink } from "vue-router";

const posts = ref([]);

onMounted(async () => {
  const allPosts = await getBlogPosts();
  posts.value = allPosts.slice(0, 3);
});
</script>

<template>
  <section v-if="posts.length > 0" class="py-24 bg-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-navyBlue text-4xl font-bold font-Rubik mb-4">Najnowsze wpisy</h2>
        <div class="w-20 h-1.5 bg-yellowMain mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="post in posts" :key="post._id" class="flex flex-col group">
          <div class="h-48 overflow-hidden rounded-2xl mb-4 bg-gray-100">
             <img v-if="post.image" :src="UPLOADS_URL + '/' + post.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             <div v-else class="w-full h-full flex items-center justify-center bg-navyBlue/5">
                <i class="pi pi-images text-3xl text-gray-300"></i>
             </div>
          </div>
          <span class="text-yellowMain font-bold text-xs uppercase tracking-widest mb-2">{{ post.category }}</span>
          <h3 class="text-xl font-bold text-navyBlue mb-3 group-hover:text-yellowMain transition-colors line-clamp-2">
            {{ post.title }}
          </h3>
          <p class="text-gray-500 text-sm line-clamp-2 mb-4">
            {{ post.content.replace(/<[^>]*>?/gm, '') }}
          </p>
          <RouterLink :to="'/blog/' + post._id" class="text-navyBlue font-bold text-sm flex items-center gap-2 hover:text-yellowMain transition-colors">
            Czytaj więcej <i class="pi pi-arrow-right text-xs"></i>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
