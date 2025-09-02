<script setup lang="ts">
import type { NotificationData, StockNotification } from '@/types/stock.type';
import { OverlayBadge } from 'primevue';
import { io, type Socket } from 'socket.io-client';
import { onMounted, onUnmounted, ref } from 'vue';
import PopOver from '../popover/PopOver.vue';
import NotificationPanel from '../navBar/NotificationPanel.vue';

// let socket: Socket;
const data = ref<StockNotification>();
const socket = ref<Socket>();

const notificationPanel = ref<{
  toggle: (event?: Event, target?: unknown) => void;
}>();

onMounted(() => {
  getNotification();
});

const getNotification = (): void => {
  socket.value = io('/', {
    transports: ['websocket'],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
  });
  // socket.value = io(config.apiURL, {
  //   transports: ['websocket'],
  //   withCredentials: true,
  //   reconnection: true,
  //   reconnectionAttempts: Infinity,
  //   reconnectionDelay: 2000,
  // });

  socket.value.on('connect', () => {
    console.log('Connected to notification server');
    socket.value?.on('message', (args: StockNotification) => {
      data.value = args;
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          if (args.outOfStock?.length > 0) {
            args.outOfStock.forEach((item) => {
              new Notification(`Ada Barang di ${item?.location} yang habis`, {
                body: `${item.productName}`,
                icon: '/favicon.ico',
              });
            });
          }
        }
      });
    });
  });
};

onUnmounted(() => {
  if (socket.value) socket.value?.disconnect();
});
</script>
<template>
  <div
    @click="notificationPanel?.toggle($event)"
    class="flex flex-wrap justify-center hover:cursor-pointer"
  >
    <OverlayBadge
      v-if="data && data?.length > 0"
      :value="data?.length"
      size="small"
      :pt="{
        pcBadge: {
          root: {
            class:
              '!bg-red-500 !text-white !text-[10px] !min-w-[18px] !h-[18px]',
          },
        },
      }"
    >
      <i class="pi pi-bell" style="font-size: 18px; padding: 2px" />
    </OverlayBadge>
    <i v-else class="pi pi-bell" style="font-size: 18px; padding: 2px" />
  </div>
  <PopOver
    ref="notificationPanel"
    :pt="{
      root: {
        class: [
          '!h-max !rounded-lg !absolute !top-12 !mt-2 !z-40 !bg-white !text-general-800 !overflow-auto !p-px scrollbar-dialog',
        ],
      },
      content: {
        class: '!bg-transparent !shadow-none !p-0 !rounded-lg',
      },
    }"
  >
    <NotificationPanel
      @toggle-panel="notificationPanel?.toggle()"
      :data="data?.data as NotificationData[]"
    />
  </PopOver>
</template>
<style>
.scrollbar-dialog {
  scrollbar-width: 3px !important;
}
.scrollbar-dialog::-webkit-scrollbar-track {
  background: #f1f1f1;
}
</style>
