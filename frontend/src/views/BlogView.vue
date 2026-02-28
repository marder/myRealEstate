<script setup>
import { ref, onMounted, watch } from "vue";
import { getPaginatedBlogPosts, UPLOADS_URL, getPageData } from "@/services/api";
import { updateMetaTags } from "@/utils/seo";
import BlogCardSkeleton from "@/components/BlogCardSkeleton.vue";

const posts = ref([]);
const isLoading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const postsPerPage = 6;

const fetchPosts = async () => {
  isLoading.value = true;
  const data = await getPaginatedBlogPosts(currentPage.value, postsPerPage);
  posts.value = data.results || [];
  totalPages.value = data.totalPages || 1;
  isLoading.value = false;
  
  // Scroll to top of posts grid
  if (!isLoading.value) {
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }
};

onMounted(async () => {
  fetchPosts();
  const pageData = await getPageData('blog');
  if (pageData) {
    updateMetaTags(pageData.metaTitle || 'Aktualności - JUNKIERT INVESTMENT', pageData.metaDescription || 'Z życia pracowni geodezyjnej - porady, realizacje i nowości.');
  }
});

watch(currentPage, fetchPosts);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <section class="bg-navyBlue py-24 text-white text-center relative overflow-hidden">
      <div class="absolute -top-10 -right-10 w-64 h-64 bg-yellowMain/10 rounded-full"></div>
      <div class="absolute -bottom-10 -left-10 w-96 h-96 bg-white/5 rounded-full"></div>
      
      <div class="container mx-auto px-6 relative z-10">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold font-Rubik mb-4">Aktualności</h1>
        <p class="text-yellowMain uppercase tracking-widest font-bold max-w-2xl mx-auto">
          Z życia pracowni geodezyjnej - porady, realizacje i nowości.
        </p>
        <div class="w-24 h-1.5 bg-yellowMain mx-auto mt-8 rounded-full"></div>
      </div>
    </section>

    <!-- Posts Grid -->
    <section class="py-20">
      <div class="container mx-auto px-6">
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <BlogCardSkeleton v-for="n in postsPerPage" :key="n" />
        </div>
        <div v-else-if="posts.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm">
          <p class="text-xl text-gray-500">Obecnie nie ma żadnych opublikowanych artykułów.</p>
        </div>
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <RouterLink v-for="post in posts" :key="post._id" 
                 :to="'/blog/' + post._id"
                 class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group cursor-pointer">
              
              <!-- Image (Fallback if no image) -->
              <div class="h-64 overflow-hidden relative">
                <div v-if="!post.image" class="w-full h-full bg-navyBlue flex items-center justify-center">
                  <i class="pi pi-images text-4xl text-yellowMain/50"></i>
                </div>
                <img v-else :src="UPLOADS_URL + '/' + post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute top-4 left-4 bg-yellowMain text-navyBlue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                  {{ post.category }}
                </div>
              </div>

              <!-- Content -->
              <div class="p-8 flex-grow flex flex-col space-y-4">
                <div class="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <span class="flex items-center gap-1"><i class="pi pi-calendar"></i> {{ new Date(post.createdAt).toLocaleDateString('pl-PL') }}</span>
                  <span class="flex items-center gap-1"><i class="pi pi-user"></i> {{ post.author }}</span>
                </div>
                
                <h2 class="text-2xl font-bold text-navyBlue font-Rubik leading-snug group-hover:text-yellowMain transition-colors">
                  {{ post.title }}
                </h2>
                
                <p class="text-gray-500 line-clamp-3 text-sm leading-relaxed">
                  {{ post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) }}...
                </p>

                <div class="pt-4 mt-auto">
                  <div class="inline-flex items-center gap-2 font-bold text-navyBlue group-hover:text-yellowMain transition-colors group/btn">
                    Czytaj więcej
                    <i class="pi pi-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>

          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="mt-16 flex justify-center items-center gap-4">
            <button 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
              class="w-12 h-12 rounded-full border-2 border-navyBlue/10 flex items-center justify-center text-navyBlue hover:bg-yellowMain hover:border-yellowMain disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-navyBlue/10 transition-all shadow-sm"
            >
              <i class="pi pi-chevron-left"></i>
            </button>
            
            <div class="flex items-center gap-2">
              <button 
                v-for="page in totalPages" 
                :key="page"
                @click="changePage(page)"
                class="w-12 h-12 rounded-full font-bold transition-all"
                :class="currentPage === page ? 'bg-navyBlue text-white shadow-lg scale-110' : 'text-navyBlue hover:bg-gray-100'"
              >
                {{ page }}
              </button>
            </div>

            <button 
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
              class="w-12 h-12 rounded-full border-2 border-navyBlue/10 flex items-center justify-center text-navyBlue hover:bg-yellowMain hover:border-yellowMain disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-navyBlue/10 transition-all shadow-sm"
            >
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
