<script setup lang="ts">
import Animation from '@/components/animation/Animation.vue';
</script>
<template>
  <div class="w-full h-screen">
    <div class="flex flex-col">
      <div class="flex justify-center items-center py-10">
        <Animation animation="404" class="w-[300px] h-[300px]" />
      </div>
      <div class="flex flex-col items-center text-gray-500 mt-1 h-full">
        <h1 class="text-2xl font-bold">Halaman Tidak ditemukan</h1>
        <p class="mt-2 w-[600px] text-center">
          Maaf, halaman yang Anda cari tidak ditemukan. Silakan periksa URL atau
          kembali ke halaman utama.
        </p>
      </div>
    </div>
  </div>
</template>
