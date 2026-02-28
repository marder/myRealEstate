<template>
  <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col animate-pulse">
    <!-- Image Skeleton -->
    <div class="h-64 bg-gray-200 relative">
      <div class="absolute top-4 left-4 h-6 w-24 bg-gray-300 rounded-full"></div>
    </div>

    <!-- Content Skeleton -->
    <div class="p-8 flex-grow flex flex-col space-y-4">
      <!-- Date & Author Skeleton -->
      <div class="flex items-center gap-4 text-xs">
        <div class="h-4 w-24 bg-gray-200 rounded"></div>
        <div class="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
      
      <!-- Title Skeleton -->
      <div class="h-6 w-full bg-gray-300 rounded"></div>
      <div class="h-6 w-3/4 bg-gray-300 rounded"></div>
      
      <!-- Text Skeleton -->
      <div class="h-4 w-full bg-gray-200 rounded"></div>
      <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
      <div class="h-4 w-4/5 bg-gray-200 rounded"></div>

      <!-- Button Skeleton -->
      <div class="pt-4 mt-auto">
        <div class="h-8 w-32 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </div>
</template>