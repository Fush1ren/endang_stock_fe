<script setup lang="ts">
import { computed } from 'vue';
import type { BreadcrumbProps } from './Breadcrumb.vue.d';
import { useRouter } from 'vue-router';

const props = defineProps<BreadcrumbProps>();
const lastIndex = computed(() => props.menus.length - 1);

const router = useRouter();

const navigateToUrl = (url: string) => {
  if (!url) return;
  router.push(url).catch((err) => {
    console.error('Error navigating to URL:', err);
  });
};

const spanClasses = (context: any) => ({
  'font-semibold': context.lastItem,
  'text-primary-400': !context.lastItem && !context.firstItem,
});
</script>

<template>
  <div
    class="flex text-black gap-[5px] items-center text-left h-[21px] text-xs font-normal leading-none"
  >
    <template :key="menu.route" v-for="(menu, index) in props.menus">
      <span
        :class="
          spanClasses({
            firstItem: index == 0,
            lastItem: index == lastIndex,
            hasRoute: !!menu.route,
          })
        "
      >
        <a
          v-if="menu.route"
          :href="menu.route"
          :title="menu.title"
          class="cursor-pointer text-primary"
          @click="navigateToUrl(menu.route!)"
        >
          {{ menu.name }}
        </a>

        <template v-else>
          {{ menu.name }}
        </template>
      </span>

      <span v-if="index != lastIndex">></span>
    </template>
  </div>
</template>
