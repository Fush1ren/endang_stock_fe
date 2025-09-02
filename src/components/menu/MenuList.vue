<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../icons/Icon.vue';
import type { Icons } from '../icons/Icons.vue';
import type { MenuItemProps } from './Menu.vue.d';

const props = defineProps<MenuItemProps>();

const labelCLass = computed(() => [
  'text-xs',
  props.item.danger ? 'text-red-500' : '',
]);
</script>

<template>
  <a
    aria-hidden="true"
    data-pc-section="action"
    tabindex="-1"
    class="flex gap-2 items-center !pl-1 hover:cursor-pointer"
  >
    <Icon
      v-if="props.item.icon"
      :icon="props.item.icon as Icons"
      :severity="props.item.danger ? 'danger' : undefined"
    />

    <span data-pc-section="label" :class="labelCLass">
      {{ props.item.label }}
    </span>
  </a>
</template>
