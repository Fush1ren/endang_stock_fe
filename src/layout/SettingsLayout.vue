<script setup lang="ts">
import { computed } from 'vue';
import type { BreadcrumbMenu } from '@/components/breadcrumb/Breadcrumb.vue.d';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import { useRoute } from 'vue-router';
import type { RouteType } from '@/types/route.type';

const route = useRoute();

const routeRaw = computed(() => {
  return route.path.split('/');
});

const childFirst = computed<RouteType>(() => {
  if (routeRaw.value.length > 1 && routeRaw.value[2] === 'users') {
    return {
      name: 'Pengguna',
      route: '/settings/users',
    };
  }
  return {
    name: 'Hak Akses',
    route: '/settings/role',
  };
});

const childAction = computed<RouteType>(() => {
  if (routeRaw.value.length > 2 && routeRaw.value[3] === 'add') {
    return {
      name: `Tambah ${childFirst.value?.name}`,
      route: `/${routeRaw.value[1]}/${routeRaw.value[2]}/add`,
    };
  } else if (routeRaw.value.length > 2 && routeRaw.value[3] === 'edit') {
    return {
      name: `Edit ${childFirst.value?.name}`,
      route: `/${routeRaw.value[1]}/${routeRaw.value[2]}/edit`,
    };
  }
  return {
    name: 'Detail',
    route: `/${routeRaw.value[1]}/${routeRaw.value[2]}/detail`,
  };
});

const breadcrumbMenus = computed<BreadcrumbMenu[]>(() => {
  let menu: BreadcrumbMenu[] = [
    {
      name: 'Pengaturan',
      route: '/settings',
    },
  ];
  if (routeRaw.value.length > 2) {
    menu = [...menu, childFirst.value];
  }
  if (routeRaw.value.length > 3) {
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
