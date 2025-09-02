<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps } from './Button.vue.d';

const props = withDefaults(defineProps<ButtonProps>(), {
  label: 'Click',
  severity: 'primary',
  type: 'button',
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const severityClass = computed((): string => {
  switch (props.severity) {
    case 'primary':
      return 'bg-blue-500 text-white hover:bg-blue-500/60';
    case 'secondary':
      return 'bg-gray-500 text-white hover:bg-gray-500/60';
    case 'success':
      return 'bg-green-500 text-white hover:bg-green-500/60';
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-500/60';
    case 'warning':
      return 'bg-yellow-500 text-black hover:bg-yellow-500/60';
    default:
      return '';
  }
});

const buttonClick = (event: MouseEvent): void => {
  event.stopPropagation();
  event.preventDefault();
  emit('click', event);
};
</script>

<template>
  <button
    :class="[
      '!p-1.5 !rounded-sm !border-none text-sm hover:cursor-pointer',
      severityClass,
      props.class,
    ]"
    @click="buttonClick($event)"
    :type="props.type"
  >
    {{ props.label }}
  </button>
</template>
