<script setup lang="ts">
import eventBus from '@/components/event-bus';
import NavBar from '@/components/navBar/NavBar.vue';
import SideBar from '@/components/sideBar/SideBar.vue';
import UserService from '@/service/user.service';
import type { UserType } from '@/types/storage.type';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isOpen = ref<boolean>(true);
const screenWidth = ref(window.innerWidth);

onMounted(() => {
  window.addEventListener('resize', updateWidth);
  if (
    route.path?.split('/').pop() !== 'login' &&
    route.path?.split('/').pop() !== '404'
  ) {
    getUser();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth);
});

const canView = computed((): boolean => {
  return (
    route.path?.split('/').pop() !== 'login' &&
    route.path?.split('/').pop() !== '404' &&
    route.path?.split('/').pop() !== 'profile'
  );
});

const canViewNavbar = computed((): boolean => {
  return (
    route.path?.split('/').pop() !== 'login' &&
    route.path?.split('/').pop() !== '404'
  );
});

const updateWidth = (): void => {
  screenWidth.value = window.innerWidth;
};

const getUser = async (): Promise<void> => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.error('User data not found in local storage');
      return;
    }
    const dataUser = JSON.parse(userData) as UserType;
    const { data } = await UserService.getProfile(dataUser?.id);
    eventBus.emit('data-user:update', data.data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

watch(
  () => screenWidth.value,
  (newWidth) => {
    isOpen.value = newWidth >= 1024; // Toggle sidebar visibility based on screen width
  },
  { immediate: true },
);

watch(
  () => route.path,
  () => {
    if (
      route.path?.split('/').pop() !== 'login' &&
      route.path?.split('/').pop() !== '404'
    ) {
      getUser();
    }
  },
);
</script>
<template>
  <div :id="canView ? 'main-layout' : 'auth-layout'" class="font-poppins">
    <div class="flex flex-row">
      <SideBar
        v-if="canView"
        :class="`${isOpen ? '' : 'hidden'} transition-normal`"
      />
      <div class="w-full overflow-hidden">
        <NavBar v-if="canViewNavbar" v-model:visible="isOpen" />
        <router-view />
      </div>
    </div>
  </div>
</template>
