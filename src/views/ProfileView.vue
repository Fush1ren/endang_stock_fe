<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import FileUpload from '@/components/fileupload/FileUpload.vue';
import Icon from '@/components/icons/Icon.vue';
import Image from '@/components/image/Image.vue';
import InputPassword from '@/components/inputpassword/InputPassword.vue';
import InputText from '@/components/inputtext/InputText.vue';
import config from '@/config';
import UserService from '@/service/user.service';
import type { ApiError } from '@/types/api.type';
import type { UserProfile } from '@/types/user.type';
import { Divider, useToast } from 'primevue';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

onMounted(() => {
  getProfile();
});

const router = useRouter();
const toast = useToast();

const profile = ref<UserProfile>();
const nameModel = ref<string>();
const usernameModel = ref<string>();
const emailModel = ref<string>();
const passwordModel = ref<string>();
const photoModel = ref<File>();
const isShow = ref<boolean>(false);

const showFields = (): void => {
  isShow.value = !isShow.value;
};

const backRoute = (): void => {
  router.back();
};

const clearFields = (): void => {
  nameModel.value = undefined;
  usernameModel.value = undefined;
  emailModel.value = undefined;
  passwordModel.value = undefined;
  photoModel.value = undefined;
};

const getProfile = async (): Promise<void> => {
  try {
    const userId = sessionStorage.getItem('users');
    if (!userId) {
      console.error('User ID not found in session storage');
      return;
    }
    const { data } = await UserService.getProfile(Number(userId));

    profile.value = data.data;
    nameModel.value = profile.value.name;
    usernameModel.value = profile.value.username;
    emailModel.value = profile.value.email;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

const updateProfile = async (): Promise<void> => {
  try {
    if (!nameModel?.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama harus diisi',
        life: 3000,
      });
      return;
    }

    if (!usernameModel?.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Username harus diisi',
        life: 3000,
      });
      return;
    }
    if (!emailModel?.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Email harus diisi',
        life: 3000,
      });
      return;
    }

    if (nameModel?.value?.length > 50) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama tidak boleh lebih dari 50 karakter',
        life: 3000,
      });
      return;
    }

    if (usernameModel?.value?.length > 15) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Username tidak boleh lebih dari 15 karakter',
        life: 3000,
      });
      return;
    }

    if (emailModel?.value?.length > 50) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Email tidak boleh lebih dari 50 karakter',
        life: 3000,
      });
      return;
    }
    if (passwordModel?.value && passwordModel?.value?.length < 6) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Password harus minimal 6 karakter',
        life: 3000,
      });
      return;
    }

    if (passwordModel?.value && passwordModel?.value?.length > 100) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Password tidak boleh lebih dari 100 karakter',
        life: 3000,
      });
      return;
    }

    if (photoModel?.value && photoModel?.value?.size > 600000) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Ukuran foto tidak boleh lebih dari 600KB',
        life: 3000,
      });
      return;
    }

    if (photoModel?.value && !photoModel?.value?.type.startsWith('image/')) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'File yang diunggah harus berupa gambar',
        life: 3000,
      });
      return;
    }

    const body = {
      name: nameModel.value as string,
      username: usernameModel.value as string,
      email: emailModel.value as string,
      password: passwordModel.value as string,
      photo: photoModel.value ? photoModel.value : null,
    };
    await UserService.updateProfile(profile.value?.id as number, body);
    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil memperbarui profil',
      life: 3000,
    });
    isShow.value = true;
    router.back();
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal memperbarui profil',
      life: 3000,
    });
  }
};

watch(
  () => isShow.value,
  () => {
    if (!isShow.value) {
      nameModel.value = profile.value?.name;
      usernameModel.value = profile.value?.username;
      emailModel.value = profile.value?.email;
    }
  },
);
</script>
<template>
  <div class="w-full bg-[#eeedf2] profile-view">
    <div class="flex flex-col gap-2 p-4">
      <h1 class="text-2xl font-bold mb-4">Profile</h1>
      <Card class="p-4">
        <form
          class="flex flex-col justify-between"
          @submit.prevent="updateProfile"
        >
          <div class="flex flex-col gap-4">
            <h1 class="text-xl font-bold mb-4">{{ profile?.name }}</h1>
            <div class="flex gap-14 w-full">
              <div class="w-[30%]">
                <Image
                  v-if="profile?.photo"
                  :src="profile?.photo as string"
                  class="object-cover overflow-hidden"
                  type="default"
                  :preview="true"
                />
                <Image
                  v-else
                  class="object-cover overflow-hidden"
                  :src="`${config.initialImage}${profile?.username}`"
                  type="default"
                  :preview="false"
                />
              </div>
              <div class="flex flex-col gap-2 w-full">
                <div class="flex flex-col gap-4 w-full space-y-2 py-8">
                  <div class="flex flex-row gap-2 items-center">
                    <span class="text-base font-medium w-[100px]">Nama</span>
                    <span class="text-base font-medium">:</span>
                    <span class="text-base">{{ profile?.name }}</span>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <span class="text-base font-medium w-[100px]"
                      >Username</span
                    >
                    <span class="text-base font-medium">:</span>
                    <span class="text-base">{{ profile?.username }}</span>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <span class="text-base font-medium w-[100px]">Email</span>
                    <span class="text-base font-medium">:</span>
                    <span class="text-base">{{ profile?.email }}</span>
                  </div>
                  <div class="flex flex-row gap-2 items-center">
                    <span class="text-base font-medium w-[100px]">Posisi</span>
                    <span class="text-base font-medium">:</span>
                    <span class="text-base">{{ profile?.roles?.name }}</span>
                  </div>
                </div>
                <div v-if="isShow">
                  <Divider align="center" type="dotted">
                    <b>Ubah Profile</b>
                  </Divider>
                  <div class="flex flex-col gap-4 px-8">
                    <div class="">
                      <InputText
                        v-model="nameModel"
                        label="Nama"
                        placeholder="Masukkan nama"
                      />
                    </div>
                    <div class="">
                      <InputText
                        v-model="usernameModel"
                        label="Username"
                        placeholder="Masukkan username"
                      />
                    </div>
                    <div class="">
                      <InputText
                        v-model:model-value="emailModel"
                        label="Email"
                        placeholder="Masukkan Email"
                        type="email"
                      />
                    </div>
                    <div class="">
                      <InputPassword
                        v-model:model-value="passwordModel"
                        :mandatory="false"
                        label="Password Baru"
                        placeholder="Masukkan password"
                      />
                    </div>
                    <div>
                      <FileUpload
                        v-model:model-value="photoModel"
                        :mandatory="false"
                        label="Foto"
                        @upload="photoModel = $event"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-8">
            <button
              type="button"
              @click="backRoute"
              class="text-xs rounded-sm !px-2 !py-1 bg-black text-white hover:bg-black/60 hover:cursor-pointer shadow-md border-1 border-gray-600"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="showFields"
              class="text-xs rounded-sm !px-2 !py-1 bg-blue-400 text-white hover:bg-blue-500/60 hover:cursor-pointer shadow-md border-1 border-blue-600"
            >
              {{ !isShow ? 'Ubah Profile' : 'Tutup' }}
              <Icon :icon="!isShow ? 'edit-2' : 'close'" type="line" />
            </button>
            <button
              type="button"
              v-if="isShow"
              @click="clearFields"
              class="text-xs rounded-sm !px-2 !py-1 bg-transparent text-red-500 hover:bg-red-500/60 hover:text-white hover:cursor-pointer shadow-md border-1 border-red-500"
            >
              Bersihkan Field
            </button>
            <button
              v-if="isShow"
              type="submit"
              class="text-xs rounded-sm !px-2 !py-1 bg-green-400 text-white hover:bg-green-400/60 hover:text-white hover:cursor-pointer shadow-md border-1 border-green-500"
            >
              Submit
            </button>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>
<style scoped>
.profile-view {
  height: calc(100vh - 4rem);
  overflow-y: auto;
  background-color: #eeedf2;
  scrollbar-width: thin;
  scrollbar-color: #bac1c5 transparent;
}
</style>
