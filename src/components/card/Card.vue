<script setup lang="ts">
import PrimeCard from 'primevue/card';
import type { CardProps } from './Card.vue.d';

const props = defineProps<CardProps>();
</script>
<template>
  <PrimeCard :pt="props.pt">
    <template #content>
      <slot />
    </template>
  </PrimeCard>
</template>
