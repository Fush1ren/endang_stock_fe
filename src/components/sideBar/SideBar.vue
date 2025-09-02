<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { SideBarContent } from './SideBar.vue.d';
import { useRoute, useRouter } from 'vue-router';
import Icon from '../icons/Icon.vue';
import type { Icons } from '../icons/Icons.vue.d';
import { getStockAppPermission } from '@/utils/auth.utils';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  setSideBarContent();
});

const contents = ref<SideBarContent[]>();

const path = computed((): string[] => {
  return route.path.split('/');
});

const setSideBarContent = (): void => {
  contents.value = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      visible: true,
      path: '/dashboard',
    },
    {
      title: 'Barang',
      icon: 'box-3',
      path: '/product',
      isOpen: false,
      visible:
        getStockAppPermission('product').view ||
        getStockAppPermission('brand').view ||
        getStockAppPermission('category').view ||
        getStockAppPermission('unit').view,
      children: [
        {
          title: 'Data Barang',
          path: '/data',
          visible: getStockAppPermission('product').view,
        },
        {
          title: 'Brand',
          path: '/brand',
          visible: getStockAppPermission('brand').view,
        },
        {
          title: 'Kategori',
          path: '/category',
          visible: getStockAppPermission('category').view,
        },
        {
          title: 'Satuan',
          path: '/unit',
          visible: getStockAppPermission('unit').view,
        },
      ],
    },
    {
      title: 'Kelola Barang',
      icon: 'inbox-archive',
      path: '/manage-product',
      isOpen: false,
      visible:
        getStockAppPermission('product_in').view ||
        getStockAppPermission('product_out').view ||
        getStockAppPermission('product_mutation').view,
      children: [
        {
          title: 'Barang Masuk',
          path: '/product-in',
          visible: getStockAppPermission('product_in').view,
        },
        {
          title: 'Barang Keluar',
          path: '/product-out',
          visible: getStockAppPermission('product_out').view,
        },
        {
          title: 'Mutasi Barang',
          path: '/product-mutation',
          visible: getStockAppPermission('product_mutation').view,
        },
      ],
    },
    {
      title: 'Toko',
      icon: 'store',
      path: '/store',
      visible: getStockAppPermission('store').view,
    },
    {
      title: 'Gudang',
      icon: 'home-4',
      path: '/warehouse',
      visible: getStockAppPermission('warehouse_stock').view,
    },
    {
      title: 'Laporan',
      icon: 'file-list',
      path: '/report',
      isOpen: false,
      visible:
        getStockAppPermission('product_in').view &&
        getStockAppPermission('product_out').view &&
        getStockAppPermission('product_mutation').view,
      children: [
        {
          title: 'Barang Masuk',
          path: '/product-in',
          visible: getStockAppPermission('product_in').view,
        },
        {
          title: 'Barang Keluar',
          path: '/product-out',
          visible: getStockAppPermission('product_out').view,
        },
        {
          title: 'Barang Mutasi',
          path: '/product-mutation',
          visible: getStockAppPermission('product_mutation').view,
        },
      ],
    },
    {
      title: 'Pengaturan',
      icon: 'settings',
      isOpen: false,
      path: '/settings',
      visible:
        getStockAppPermission('setting_user').view ||
        getStockAppPermission('setting_role').view,
      children: [
        {
          title: 'Pengguna',
          path: '/users',
          visible: getStockAppPermission('setting_user').view,
        },
        {
          title: 'Hak Akses',
          path: '/role',
          visible: getStockAppPermission('setting_role').view,
        },
      ],
    },
  ];
};

const handleMainMenu = (content: SideBarContent): void => {
  if (content.children) {
    content.isOpen = !content.isOpen;
    return;
  }
  if (content.path === `/${path.value}`) return;
  router.push(content.path as string);
};

const handleChildrenMenu = (
  main: SideBarContent,
  child: SideBarContent,
): void => {
  if (child.path === `/${path.value}`) return;
  router.push(`${main.path}${child.path as string}`);
};

const activeTab = (content: SideBarContent): boolean => {
  return path.value.includes(content.path?.replace('/', '') as string);
};

const activeChildPath = (
  main: SideBarContent,
  child: SideBarContent,
): boolean => {
  const pathNow = path.value.join('/');
  return pathNow.includes(`${main.path}${child.path}`);
};

const mainBackground = (length: number): string => {
  return length > 0
    ? 'bg-[#f3f4f6] text-black cursor-pointer'
    : 'bg-blue-500 text-white cursor-pointer';
};
</script>

<template>
  <aside id="sidebar" class="w-[255px] bg-white text-black">
    <div class="w-full px-4 py-5">
      <div class="flex items-center justify-center mb-4">
        <span class="text-lg font-semibold text-center">Endang Stock</span>
      </div>
      <div class="relative pb-3 rounded-md py-4">
        <div
          class="overflow-y-auto scroll-smooth scrollbar-thin scroll-m-2 scroll"
        >
          <ul class="flex flex-col m-0 p-0 gap-1 list-none h-[85vh]">
            <li
              :key="index"
              v-for="(item, index) in contents"
              class="rounded-md grid items-center gap-1 focus:outline-none focus:outline-offset-0"
            >
              <div
                v-if="item.visible"
                @click="handleMainMenu(item)"
                :class="`flex items-center gap-2 w-full px-[8px] py-[5px] h-[30px] ${
                  activeTab(item)
                    ? `${mainBackground(item?.children?.length as number)} rounded-md`
                    : 'hover:bg-[#f3f4f6] rounded-md cursor-pointer transition duration-200 ease-in-out'
                }`"
              >
                <Icon class="!text-sm" :icon="item.icon as Icons" />
                <span class="text-xs font-normal">
                  {{ item.title }}
                </span>
                <div v-if="item.children" class="ml-auto flex items-center">
                  <Icon
                    class="text-sm"
                    :icon="item.isOpen ? 'arrow-up-s' : 'arrow-down-s'"
                  />
                </div>
              </div>
              <ul
                v-if="item.children"
                :class="`grid gap-1 list-none ${item.isOpen ? 'block' : 'hidden'}`"
              >
                <li
                  :key="index"
                  v-for="(child, index) in item.children"
                  class="rounded-md grid gap-1 focus:outline-none focus:outline-offset-0"
                >
                  <div
                    v-if="child.visible"
                    @click="handleChildrenMenu(item, child)"
                    :class="`flex items-center gap-2 px-8 w-full py-[5px] h-[30px] ${
                      activeChildPath(item, child)
                        ? 'bg-primary rounded-md text-white cursor-pointer'
                        : 'hover:bg-[#f3f4f6] rounded-md cursor-pointer transition duration-200 ease-in-out'
                    }`"
                  >
                    <span class="text-xs font-normal">
                      {{ child.title }}
                    </span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>
<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
</style>
