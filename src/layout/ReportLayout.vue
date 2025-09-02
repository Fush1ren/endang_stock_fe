<script setup lang="ts">
import { computed } from 'vue';
import type { BreadcrumbMenu } from '@/components/breadcrumb/Breadcrumb.vue.d';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const routerRaw = computed(() => {
  return route.path.split('/');
});

const childFirst = computed<BreadcrumbMenu>(() => {
  if (routerRaw.value.length > 1 && routerRaw.value[2] === 'product-in') {
    return {
      name: 'Barang Masuk',
      route: '/report/product-in',
    };
  } else if (
    routerRaw.value.length > 1 &&
    routerRaw.value[2] === 'product-out'
  ) {
    return {
      name: 'Barang Keluar',
      route: '/report/product-out',
    };
  }
  return {
    name: 'Mutasi Barang',
    route: '/report/product-mutation',
  };
});

const childAction = computed<BreadcrumbMenu>(() => {
  return {
    name: 'print',
    route: `/${routerRaw.value[1]}/${routerRaw.value[2]}/print`,
  };
});

const breadcrumbMenus = computed<BreadcrumbMenu[]>(() => {
  let menu: BreadcrumbMenu[] = [
    {
      name: 'Laporan',
      route: '/report',
    },
  ];

  if (routerRaw.value.length > 2) {
    menu = [...menu, childFirst.value];
  }
  if (routerRaw.value.length > 3) {
    menu = [...menu, childAction.value];
  }
  return menu;
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
