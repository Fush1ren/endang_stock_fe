<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import Image from '../image/Image.vue';
import config from '@/config';
import Icon from '../icons/Icon.vue';
import PopOver from '../popover/PopOver.vue';
import NavBarProfilePanel from './NavBarProfilePanel.vue';
import NotificationBell from '../notificationbell/NotificationBell.vue';
import eventBus, { type Events } from '../event-bus';
import type { UserProfile } from '@/types/user.type';
import { useRoute } from 'vue-router';

const user = ref<UserProfile>();

const route = useRoute();

const profilePanel = ref<{
  toggle: (event?: Event, target?: unknown) => void;
}>();

const modelValue = defineModel<boolean>('visible', {
  default: true,
});

onMounted(() => {
  attachEventListener();
});

onUnmounted(() => {
  removeEventListener();
});

const routePath = computed((): string => {
  return route.path.split('/').pop() as string;
});

const getUser = (e: Events['data-user:update']): void => {
  if (e) {
    user.value = e;
  }
};

const attachEventListener = (): void => {
  eventBus.on('data-user:update', getUser);
};

const removeEventListener = (): void => {
  eventBus.off('data-user:update', getUser);
};

const toggleSideBar = () => {
  modelValue.value = !modelValue.value;
};
</script>
<template>
  <nav class="w-full">
    <div
      :class="`w-full h-16 bg-[#e0dce3] ${
        routePath !== 'login' && routePath !== '404' && routePath !== 'profile'
          ? 'grid items-center gap-3 grid-cols-2'
          : 'flex justify-end'
      } text-black px-6`"
    >
      <div
        v-if="
          routePath !== 'login' &&
          routePath !== '404' &&
          routePath !== 'profile'
        "
        @click="toggleSideBar"
        class="w-[28px] h-[28px] hover:bg-gray-500/20 text-center hover:rounded-md flex items-center justify-center hover:scale-105"
      >
        <div>
          <Icon icon="menu" class="w-10 h-10" />
        </div>
      </div>
      <div class="flex items-center justify-end gap-3">
        <div class="px-2">
          <NotificationBell />
        </div>
        <div class="flex gap-1 items-center justify-center">
          <div class="flex flex-col gap-px items-center px-px">
            <span class="font-semibold text-xs">{{ user?.name ?? '-' }}</span>
            <span class="text-xs font-normal text-slate-600">{{
              user?.roles?.name ?? '-'
            }}</span>
          </div>
          <div
            @click="profilePanel?.toggle($event)"
            class="flex items-center gap-2 hover:cursor-pointer"
          >
            <Image
              v-if="user?.photo"
              class="w-10 h-10 rounded-full object-cover overflow-hidden"
              :src="user?.photo as string"
              type="profile"
              :preview="false"
            />
            <Image
              v-else
              class="w-10 h-10 rounded-full object-cover overflow-hidden"
              :src="`${config.initialImage}${user?.username}`"
              type="profile"
              :preview="false"
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
  <PopOver
    ref="profilePanel"
    :pt="{
      root: {
        class: [
          '!h-max !rounded-lg !absolute !top-12 !mt-2 !z-40 !bg-white !text-general-800 !overflow-auto !p-px',
        ],
      },
      content: {
        class: '!bg-transparent !shadow-none !p-0 !rounded-lg',
      },
    }"
  >
    <NavBarProfilePanel
      v-if="user"
      @toggle-panel="profilePanel?.toggle()"
      :user="user as UserProfile"
    />
  </PopOver>
</template>
