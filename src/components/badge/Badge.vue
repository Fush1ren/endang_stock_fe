<script setup lang="ts">
import { computed } from 'vue';
import type { BadgeProps } from './Badge.vue.d';

const props = defineProps<BadgeProps>();

const severityClass = computed((): string => {
  switch (props.severity) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    case 'danger':
      return 'bg-red-100 text-red-800';
    default:
      return '';
  }
});

function truncateMiddle(str: string) {
  if (str.length <= 8) {
    return str;
  }

  const ellipsis = '...';
  const charsToShow = 8 - ellipsis.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  const start = str.slice(0, frontChars);
  const end = str.slice(str.length - backChars);

  return start + ellipsis + end;
}
</script>
<template>
  <span
    v-if="useTooltip"
    :class="`${severityClass} py-1 px-2 rounded-full`"
    v-tooltip.top="props.label"
    >{{ truncateMiddle(props?.label as string) }}</span
  >
  <span v-else :class="`${severityClass} py-1 px-2 rounded-full`">{{
    props?.label
  }}</span>
</template>
