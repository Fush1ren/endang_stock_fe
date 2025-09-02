<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import Image from '@/components/image/Image.vue';
import config from '@/config';
import UserService from '@/service/user.service';
import type { UserDetail } from '@/types/user.type';
import { formatDate } from '@/utils/data.utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  getUserDetail();
});

const userDetail = ref<UserDetail>();

const backRoute = (): void => {
  router.back();
};

const getUserDetail = async (): Promise<void> => {
  try {
    const userId = sessionStorage.getItem('users');
    if (!userId) {
      console.error('User ID not found in session storage');
      return;
    }
    const { data } = await UserService.getUserDetail(Number(userId));

    userDetail.value = data.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};
</script>
<template>
  <Card>
    <div class="flex flex-col gap-4 text-xs">
      <div class="flex justify-between py-2">
        <span class="text-lg font-semibold">{{ userDetail?.name }}</span>
        <div class="flex flex-col gap-2 text-xs text-right">
          <span class="font-normal">Terakhir diubah pada</span>
          <div class="font-medium">
            <span>{{
              ` ${formatDate(new Date(userDetail?.updatedAt as string))} `
            }}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="w-[200px]">
          <Image
            v-if="userDetail?.photo"
            :src="userDetail?.photo as string"
            class="object-cover overflow-hidden"
            type="default"
            :preview="true"
          />
          <Image
            v-else
            class="object-cover overflow-hidden"
            :src="`${config.initialImage}${userDetail?.username}`"
            type="default"
            :preview="false"
          />
        </div>
        <div class="flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <span class="font-semibold">Username</span>
              <span>{{ userDetail?.username }}</span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="font-semibold">Email</span>
              <span>{{ userDetail?.email }}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <span class="font-semibold">Role</span>
              <span>{{ userDetail?.roles?.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end pt-8">
      <button
        type="button"
        @click="backRoute"
        class="text-xs rounded-sm !px-2 !py-1 bg-black text-white hover:bg-black/60 hover:cursor-pointer shadow-md border-1 border-gray-600"
      >
        Kembali
      </button>
    </div>
  </Card>
</template>
