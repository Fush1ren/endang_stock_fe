<script setup lang="ts">
import { Image } from 'primevue';
import type { ImageProps } from './Image.vue.d';

const props = withDefaults(defineProps<ImageProps>(), {
  type: 'default',
  preview: false,
});
</script>
<template>
  <template v-if="props.type === 'profile'">
    <Image
      :src="props.src"
      alt="preview"
      :class="props.class"
      :preview="props.preview"
    />
  </template>
  <template v-else>
    <Image
      :src="props.src"
      alt="image"
      :class="props.class"
      :preview="props.preview"
    />
  </template>
</template>
