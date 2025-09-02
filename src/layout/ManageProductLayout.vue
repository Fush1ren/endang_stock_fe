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
      route: '/manage-product/product-in',
    };
  } else if (
    routerRaw.value.length > 1 &&
    routerRaw.value[2] === 'product-out'
  ) {
    return {
      name: 'Barang Keluar',
      route: '/manage-product/product-out',
    };
  }
  return {
    name: 'Mutasi Barang',
    route: '/manage-product/product-mutation',
  };
});

const childAction = computed<BreadcrumbMenu>(() => {
  if (routerRaw.value.length > 2 && routerRaw.value[3] === 'add') {
    return {
      name: `Tambah ${childFirst.value?.name}`,
      route: `/${routerRaw.value[1]}/${routerRaw.value[2]}/add`,
    };
  } else if (routerRaw.value.length > 2 && routerRaw.value[3] === 'edit') {
    return {
      name: `Edit ${childFirst.value?.name}`,
      route: `/${routerRaw.value[1]}/${routerRaw.value[2]}/edit`,
    };
  }
  return {
    name: 'Detail',
    route: `/${routerRaw.value[1]}/${routerRaw.value[2]}/detail`,
  };
});

const breadcrumbMenus = computed<BreadcrumbMenu[]>(() => {
  let menu: BreadcrumbMenu[] = [
    {
      name: 'Kelola Barang',
      route: '/manage-product',
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
