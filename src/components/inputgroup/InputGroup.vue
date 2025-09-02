<script setup lang="ts">
import { computed } from 'vue';

import type { InputGroupProps } from './InputGroup.vue.d';
import InputGroup from 'primevue/inputgroup';

const props = defineProps<InputGroupProps>();

const inputGroupClasses = computed(() => [
  '[&_.inputgroupslot[slot-addon-variant=plain]]:!ring-[0px]',
  '[&:has(input)]:!cursor-text',
  '!h-[30px]',
  'flex items-stretch',
  'w-full',
  'bg-white',
  props.class,
]);

const focusToInput = (e: MouseEvent): void => {
  const target = e.target as HTMLElement;
  if (target) {
    const el = target.querySelector('input') as HTMLInputElement;

    el?.focus();
  }
};
</script>

<template>
  <InputGroup
    v-if="$attrs['use-input-group'] != false"
    @click="focusToInput"
    :class="inputGroupClasses"
  >
    <slot />
  </InputGroup>

  <slot v-else />
</template>
