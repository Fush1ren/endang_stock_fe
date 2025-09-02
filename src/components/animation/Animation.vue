<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import type { AnimationProps } from './Animation.vue.d';
const props = defineProps<AnimationProps>();

onMounted(async () => {
  animationData.value = await getAnimationData();
});

const animationData = shallowRef<string>();

const getAnimationData = async (): Promise<string> => {
  return (await import(`../../assets/animation/${props.animation}.lottie`))
    .default;
};
</script>
<template>
  <DotLottieVue
    v-if="animationData"
    v-bind="props"
    :src="animationData"
    :renderConfig="{
      autoResize: true,
    }"
    autoplay
    loop
  />
</template>
<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
