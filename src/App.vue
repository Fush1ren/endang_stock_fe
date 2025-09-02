<script setup lang="ts">
import { Toast } from 'primevue';
</script>

<template>
  <router-view />
  <Toast
    :pt="{
      root: {
        class: 'lg:!w-max-full !w-[300px]',
      },
      summary: {
        class: 'lg:!text-sm !text-sm',
      },
    }"
  />
</template>
