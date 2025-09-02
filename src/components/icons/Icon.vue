<script setup lang="ts">
import { computed } from 'vue';
import type { IconsProps } from './Icons.vue.d';

const props = withDefaults(defineProps<IconsProps>(), {
  severity: undefined,
  info: undefined,
  tooltipPos: 'bottom',
  class: undefined,
  type: 'line',
});

const severityClass = ((): string => {
  switch (props.severity) {
    case 'info':
      return 'text-blue-500';
    case 'success':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'danger':
      return 'text-red-500';
    default:
      return 'inherit';
  }
})();

const classes = computed(() => [
  // 'pi',
  // `pi-${props.icon}`,
  'icon',
  `ri-${props.icon}${props.type === 'none' ? '' : `-${props.type}`}`,
  severityClass,
  'text-sm',
  '!h-[22px]',
  'cursor-pointer shink-0',
]);
</script>
<template>
  <i
    v-if="tooltipPos === 'top'"
    v-tooltip.top="info"
    v-bind="$attrs"
    :class="[...classes, $props['class']]"
  />
  <i
    v-if="tooltipPos === 'bottom'"
    v-tooltip.bottom="info"
    v-bind="$attrs"
    :class="[...classes, $props['class']]"
  />
  <i
    v-if="tooltipPos === 'right'"
    v-tooltip.right="info"
    v-bind="$attrs"
    :class="[...classes, $props['class']]"
  />
  <i
    v-if="tooltipPos === 'left'"
    v-tooltip.left="info"
    v-bind="$attrs"
    :class="[...classes, $props['class']]"
  />
</template>
