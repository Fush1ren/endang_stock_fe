<script setup lang="ts">
import Animation from '@/components/animation/Animation.vue';
import InputPassword from '@/components/inputpassword/InputPassword.vue';
import InputText from '@/components/inputtext/InputText.vue';
import AuthService from '@/service/auth.service';
import type { ApiError } from '@/types/api.type';
import { setAccessToken } from '@/utils/auth.utils';
import { useToast } from 'primevue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const identifierModel = ref<string>();
const passwordModel = ref<string>();

const handleButton = async (): Promise<void> => {
  try {
    if (!identifierModel.value) {
      alert('Please enter your email or username');
      return;
    }
    if (!passwordModel.value) {
      alert('Please enter your password');
      return;
    }

    const data = await AuthService.login({
      identifier: identifierModel.value,
      password: passwordModel.value,
    });

    setAccessToken(data.data.data.accessToken);

    const user = {
      id: data.data.data.id,
      name: data.data.data.name,
      email: data.data.data.email,
      username: data.data.data.username,
      role: data.data.data.role,
      permissions: data.data.data.permissions,
      photo: data.data.data.photo,
    };

    localStorage.setItem('user', JSON.stringify(user));

    toast.add({
      severity: 'success',
      summary: 'Login Successful',
      detail: 'Redirecting to dashboard...',
      life: 2000,
    });

    router.push('/dashboard');
  } catch (error: ApiError | unknown) {
    console.error('Error during login:', error);
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal login, silakan coba lagi',
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="bg-login h-screen w-full bg-cover bg-center text-black">
    <div class="flex items-center justify-center h-screen">
      <div
        class="w-[300px] h-[350px] lg:w-[800px] lg:h-[400px] bg-white rounded-[20px]"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 h-full">
          <Animation
            animation="login"
            class="lg:w-[400px] w-[100px] lg:block hidden"
            @contextmenu.prevent
          />
          <div class="w-full h-full flex flex-col gap-4 py-5 px-4 lg:px-8">
            <div class="flex flex-col items-center justify-center gap-4">
              <span class="text-2xl font-bold">Endang Stock</span>
              <span class="text-xl font-semibold">Login</span>
            </div>
            <form
              class="flex flex-col gap-6 p-3"
              @submit.prevent="handleButton"
            >
              <div>
                <InputText
                  v-model="identifierModel"
                  label="Email or Username"
                  placeholder="Enter your email or username"
                />
              </div>
              <div>
                <InputPassword v-model:model-value="passwordModel" />
              </div>
              <button
                type="submit"
                class="bg-black text-white text-sm rounded-md font-semibold p-2 w-full mt-4 hover:bg-gray-800 hover:cursor-pointer transition duration-200"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
