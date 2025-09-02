<script setup lang="ts">
import DashboardService from '@/service/dashboard.service';
import type { DashboardTotalData } from '@/types/dashboard.type';
import { onMounted, ref } from 'vue';
import Card from '../card/Card.vue';
import Icon from '../icons/Icon.vue';

onMounted(() => {
  getDashboardTotalData();
});

const dashboardTotalData = ref<DashboardTotalData>();

const getDashboardTotalData = async (): Promise<void> => {
  try {
    const { data } = await DashboardService.getDashboardTotalData();
    dashboardTotalData.value = data.data;
  } catch (error) {
    console.error('Error fetching dashboard total data:', error);
  }
};
</script>

<template>
  <div class="w-full text-xs">
    <div class="grid grid-rows-2 gap-3">
      <div class="grid sm:grid-cols-4 gap-3">
        <Card class="w-full">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-col gap-2 text-black">
              <span class="font-medium text-xs">Data Barang</span>
              <span class="font-bold md:text-lg text-sm">{{
                dashboardTotalData?.totalProducts
              }}</span>
            </div>
            <div class="flex items-center justify-center">
              <Icon
                icon="box-3"
                class="md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default"
                type="fill"
              />
            </div>
          </div>
        </Card>
        <Card class="w-full">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-col gap-2 text-black">
              <span class="font-medium text-xs">Data Pengguna</span>
              <span class="font-bold md:text-lg text-sm">{{
                dashboardTotalData?.totalUsers
              }}</span>
            </div>
            <div class="flex items-center justify-center">
              <Icon
                icon="user"
                class="md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default"
                type="fill"
              />
            </div>
          </div>
        </Card>
        <Card class="w-full">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-col gap-2 text-black">
              <span class="font-medium text-xs">Produk Masuk (Pending)</span>
              <span class="font-bold md:text-lg text-sm">{{
                dashboardTotalData?.totalProductInPending
              }}</span>
            </div>
            <div class="flex items-center justify-center">
              <Icon
                icon="folder-warning"
                class="md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default"
                type="fill"
              />
            </div>
          </div>
        </Card>
        <Card class="w-full">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-col gap-2 text-black">
              <span class="font-medium text-xs">Produk Masuk (Selesai)</span>
              <span class="font-bold md:text-lg text-sm">{{
                dashboardTotalData?.totalProductInCompleted
              }}</span>
            </div>
            <div class="flex items-center justify-center">
              <Icon
                icon="folder-check"
                class="md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default"
                type="fill"
              />
            </div>
          </div>
        </Card>
      </div>
      <div class="grid sm:grid-cols-4 gap-3">
        <Card class="w-full">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-col gap-2 text-black">
              <span class="font-medium text-xs">Produk Keluar (Pending)</span>
              <span class="font-bold md:text-lg text-sm">{{
                dashboardTotalData?.totalProductOutPending
              }}</span>
            </div>
            <div class="flex items-center justify-center">
              <Icon
                icon="folder-warning"
                class="md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default"
                type="fill"
              />
            </div>
          </div>
        </Card>
        <Card class="w-full">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-col gap-2 text-black">
              <span class="font-medium text-xs">Produk Keluar (Selesai)</span>
              <span class="font-bold md:text-lg text-sm">{{
                dashboardTotalData?.totalProductOutCompleted
              }}</span>
            </div>
            <div class="flex items-center justify-center">
              <Icon
                icon="folder-check"
                class="md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default"
                type="fill"
              />
            </div>
          </div>
        </Card>
        <Card class="w-full">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-col gap-2 text-black">
              <span class="font-medium text-xs">Produk Mutasi (Pending)</span>
              <span class="font-bold md:text-lg text-sm">{{
                dashboardTotalData?.totalProductMutationPending
              }}</span>
            </div>
            <div class="flex items-center justify-center">
              <Icon
                icon="folder-warning"
                class="md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default"
                type="fill"
              />
            </div>
          </div>
        </Card>
        <Card class="w-full">
          <div class="flex flex-row gap-2 justify-between">
            <div class="flex flex-col gap-2 text-black">
              <span class="font-medium text-xs">Produk Mutasi (Selesai)</span>
              <span class="font-bold md:text-lg text-sm">{{
                dashboardTotalData?.totalProductMutationCompleted
              }}</span>
            </div>
            <div class="flex items-center justify-center">
              <Icon
                icon="folder-check"
                class="md:!text-4xl text-xl !h-full text-gray-500 hover:cursor-default"
                type="fill"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
