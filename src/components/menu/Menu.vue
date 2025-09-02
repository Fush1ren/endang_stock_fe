<script setup lang="ts">
import PrimeMenu from 'primevue/menu';
import type { MenuEmits, MenuItem, MenuProps } from './Menu.vue.d';
import { ref } from 'vue';
import type Menu from 'primevue/menu';
import eventBus from '../event-bus';
import filterVisibleMenu from '@/utils/menu.utils';
import MenuList from './MenuList.vue';

withDefaults(defineProps<MenuProps>(), { popup: true, model: () => [] });
const emit = defineEmits<MenuEmits>();

const overlayId = +new Date();
const menu = ref<InstanceType<typeof Menu>>();
const toggle = (e: Event): void => {
  menu.value?.toggle(e);
};

const show = (e: Event): void => {
  menu.value?.show(e);
};

const hide = (event: { overlayId: number }): void => {
  if (menu.value && event.overlayId !== overlayId) menu.value?.hide();
};

const onHideMenu = (e: Event): void => {
  emit('blur', e);

  setTimeout(() => {
    eventBus.off('overlay:show', hide);
  }, 1000);
};

const onShowMenu = (e: Event): void => {
  eventBus.on('overlay:show', hide);
  eventBus.emit('overlay:show', { overlayId });
  emit('focus', e);
};

defineExpose({
  toggle,
  show,
  hide,
});
</script>

<template>
  <PrimeMenu
    ref="menu"
    v-bind="$props"
    :model="
      filterVisibleMenu(
        $props.model as MenuItem[],
        'Tidak ada pilihan yang tersedia',
      )
    "
    @blur="onHideMenu"
    @focus="onShowMenu"
  >
    <template #item="{ item, props }">
      <MenuList :item="item" :router-props="props" />
    </template>

    <template #start v-if="$slots['start']">
      <slot name="start" />
    </template>
  </PrimeMenu>
</template>
