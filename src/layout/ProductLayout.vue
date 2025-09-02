<script setup lang="ts">
import { computed } from 'vue';
import type { BreadcrumbMenu } from '@/components/breadcrumb/Breadcrumb.vue.d';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import { useRoute } from 'vue-router';
import {
  getActionRouteMenu,
  getChildRouteMenu,
  getMainRouteMenu,
} from '@/utils/route.utils';

const route = useRoute();

const breadcrumbMenus = computed<BreadcrumbMenu[]>(() => {
  const listPath = route.path.split('/').filter((item) => item !== '');

  let routeList: BreadcrumbMenu[] = [];
  listPath.map((item, index) => {
    if (index === 0) {
      routeList = [getMainRouteMenu(item)];
    }
    if (index === 1) {
      routeList = [
        ...routeList,
        getChildRouteMenu(item, routeList[0]?.route as string),
      ];
    }
    if (index === 2) {
      routeList = [
        ...routeList,
        getActionRouteMenu(item, routeList[1]?.route as string),
      ];
    }
  });
  return routeList;
});
</script>

<template>
  <div id="main-view" class="bg-[#eeedf2] w-full overflow-y-hidden">
    <div class="flex flex-col gap-2 p-4">
      <Breadcrumb :menus="breadcrumbMenus" />
      <router-view />
    </div>
  </div>
</template>
