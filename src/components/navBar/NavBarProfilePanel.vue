<script setup lang="ts">
import Icon from '../icons/Icon.vue';
import type { Icons } from '../icons/Icons.vue';
import config from '@/config';
import Image from '../image/Image.vue';
import { useRouter } from 'vue-router';
// import AuthService from '@/service/auth.service';
import type { ProfilePanelProps } from './NavBar.vue.d';

defineEmits<{
  togglePanel: [];
}>();

const router = useRouter();

const props = defineProps<ProfilePanelProps>();

const options = [
  {
    label: 'Profile',
    name: 'profile',
    icon: 'user' as Icons,
    command: (): void => {
      sessionStorage.setItem('users', String(props?.user?.id));
      router.push('/profile');
    },
  },
  {
    label: 'Logout',
    name: 'logout',
    icon: 'logout-box' as Icons,
    danger: true,
    command: async (): Promise<void> => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      sessionStorage.clear();

      // await AuthService.logout();

      router.replace({ name: 'loginView' }).then(() => {
        window.location.reload(); // Reset semua cache Vue
      });
    },
  },
];
</script>

<template>
  <div class="w-[240px] outline-1 outline-[#F7F7FC] rounded-lg">
    <div
      class="!bg-[#e0dce3] !border-b-[1px] !border-[#D9DBE9] px-4 py-3 flex items-center gap-3"
    >
      <Image
        v-if="user?.photo"
        class="w-8 h-8 rounded-full object-cover overflow-hidden"
        :src="user?.photo as string"
        type="profile"
        preview
      />
      <Image
        v-else
        class="w-8 h-8 rounded-full object-cover overflow-hidden"
        :src="`${config.initialImage}${user?.username}`"
        type="profile"
        :preview="false"
      />
      <div class="flex flex-col overflow-wrap-anywhere">
        <span class="font-semibold text-xs">{{ user?.name ?? '-' }}</span>
        <span class="text-xs">{{ user?.email ?? '-' }}</span>
      </div>
    </div>
    <div class="pb-2">
      <ul>
        <li
          :key="option.label"
          v-for="option in options"
          :data-wv-name="`user-op-${option.name}`"
          class="cursor-pointer"
        >
          <a
            @click="(option.command(), $emit('togglePanel'))"
            aria-hidden="true"
            class="flex items-center justify-start gap-2 px-4 py-1.5 hover:bg-surface-50 no-underline overflow-hidden cursor-pointer select-none hover:bg-gray-50"
            data-pc-section="action"
            tabindex="-1"
          >
            <Icon
              :icon="option.icon ?? 'trash-2'"
              :severity="option.danger ? 'danger' : undefined"
              class="text-center"
            />
            <span
              :class="[
                'text-inherit text-xs',
                { '!text-red-500': option.danger },
              ]"
              data-pc-section="label"
            >
              {{ option.label }}
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.overflow-wrap-anywhere {
  overflow-wrap: anywhere;
}
</style>
