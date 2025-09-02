<script setup lang="ts">
import { computed } from 'vue';
import type { FieldWrapperProps } from './FieldWrapper.vue.d';

const props = withDefaults(defineProps<FieldWrapperProps>(), {
  optional: undefined,
});

const labelClasses = computed(() => [
  'text-xs flex gap-[2px] tracking-[0.02em]',
  props.labelClass,
]);
</script>
<template>
  <div
    v-if="$attrs['use-wrapp'] != false"
    class="flex flex-col items-start justify-start relative gap-1 w-full shrink-0 overflow-hidden"
  >
    <span v-if="label" :class="labelClasses">
      {{ label }}

      <span
        v-if="mandatory == false && optional"
        class="text-[10px] font-normal leading-4"
      >
        (Opsional)
      </span>
    </span>
    <slot />
  </div>
  <slot v-else />
</template>
