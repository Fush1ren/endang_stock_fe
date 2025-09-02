<script setup lang="ts">
import PrimeTabs from 'primevue/tabs';
import type { TabMenuProps } from './TabMenu.vue.d';
import { Tab, TabList } from 'primevue';

const modelValue = defineModel<number>('activeIndex', {
  default: 0,
});

const props = withDefaults(defineProps<TabMenuProps>(), {
  tabLabels: [],
});
</script>
<template>
  <div class="w-full text-xs">
    <PrimeTabs v-model:value="modelValue">
      <TabList
        :pt="{
          tabList: {
            class: '!border-bottom-1 !border-blue-200',
          },
          activeBar: {
            class: '!bg-primary',
          },
        }"
      >
        <Tab
          :value="index"
          v-for="(label, index) in props.tabLabels"
          class="!p-2"
        >
          {{ label }}
        </Tab>
      </TabList>
    </PrimeTabs>
  </div>
</template>
