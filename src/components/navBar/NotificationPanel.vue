<script setup lang="ts">
import type { NotificationData } from '@/types/stock.type';
import type { BadgeSeverity } from '../badge/Badge.vue.d';
import Badge from '../badge/Badge.vue';

interface NotificationPanelProps {
  data: NotificationData[];
}

defineEmits<{
  togglePanel: [];
}>();

const props = defineProps<NotificationPanelProps>();

const getBadgeSeverity = (status: string): BadgeSeverity => {
  switch (status) {
    case 'outOfStock':
      return 'danger';
    case 'lowStock':
      return 'warning';
    default:
      return 'success';
  }
};

const getLabelBadge = (status: string): string => {
  switch (status) {
    case 'outOfStock':
      return 'Habis';
    case 'lowStock':
      return 'Stok Rendah';
    default:
      return 'Tersedia';
  }
};
</script>

<template>
  <div class="w-[240px] h-[300px] rounded-lg overflow-y-auto overflow-x-hidden">
    <div class="flex items-center justify-center bg-[#e0dce3] py-2">
      <span class="text-center font-semibold">Notifikasi Informasi Stok</span>
    </div>
    <template v-if="props?.data && props?.data?.length > 0">
      <div class="p-2">
        <div
          :key="index"
          v-for="(item, index) in props?.data"
          class="flex flex-col gap-4"
        >
          <div
            :class="`flex flex-col ${index + 1 === props?.data?.length ? 'border-b-0' : 'border-b-[1px] border-[#001eff]'} py-2 gap-1`"
          >
            <span class="text-sm overflow-x-hidden">{{
              item?.product?.name
            }}</span>
            <div class="flex items-center justify-between">
              <Badge
                v-if="item?.product"
                :label="getLabelBadge(item?.status)"
                :severity="getBadgeSeverity(item?.status)"
                useTooltip
                class="!text-xs"
              />
              <span class="text-sm">Di {{ item?.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center justify-center py-2">
        <span class="text-sm">Tidak ada data</span>
      </div>
    </template>
  </div>
</template>
