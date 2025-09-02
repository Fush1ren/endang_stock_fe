<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import type { DropdownOption } from '@/components/dropdown/Dropdown.vue.d';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import FileUpload from '@/components/fileupload/FileUpload.vue';
import InputPassword from '@/components/inputpassword/InputPassword.vue';
import InputText from '@/components/inputtext/InputText.vue';
import UserService from '@/service/user.service';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import RoleService from '@/service/role.service';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import type { ApiError } from '@/types/api.type';

const toast = useToast();
const router = useRouter();

onMounted(() => {
  getRole();
});

const nameModel = ref<string>();
const usernameModel = ref<string>();
const emailModel = ref<string>();
const passwordModel = ref<string>();
const photoModel = ref<File>();
const roleModel = ref<DropdownOption>();
const stayModel = ref<boolean>(false);
const dropdownOptions = ref<DropdownOption[]>();

const backRoute = (): void => {
  router.push('/settings/users');
};

const clearFields = (): void => {
  nameModel.value = undefined;
  usernameModel.value = undefined;
  emailModel.value = undefined;
  passwordModel.value = undefined;
  photoModel.value = undefined;
  roleModel.value = undefined;
};

const getRole = async (): Promise<void> => {
  try {
    const { data } = await RoleService.getRoleDropdown();
    dropdownOptions.value = data.data;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gagal memuat data role',
      life: 3000,
    });
  }
};

const addUser = async (): Promise<void> => {
  try {
    if (!nameModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama harus diisi',
        life: 3000,
      });
      return;
    }
    if (!usernameModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Username harus diisi',
        life: 3000,
      });
      return;
    }
    if (!emailModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Email harus diisi',
        life: 3000,
      });
      return;
    }
    if (!passwordModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Password harus diisi',
        life: 3000,
      });
      return;
    }
    if (!roleModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Role harus dipilih',
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
    if (passwordModel?.value?.length < 6) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Password harus minimal 6 karakter',
        life: 3000,
      });
      return;
    }

    if (passwordModel?.value?.length > 100) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Password tidak boleh lebih dari 100 karakter',
        life: 3000,
      });
      return;
    }
    // Simulate API call to add user
    const newUser = {
      name: nameModel.value as string,
      username: usernameModel.value as string,
      email: emailModel.value as string,
      password: passwordModel.value as string,
      photo: photoModel.value ? photoModel.value : null,
      role: roleModel.value?.id as number,
    };

    await UserService.createUser(newUser);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Pengguna berhasil ditambahkan',
      life: 3000,
    });

    // Reset form fields after successful submission
    clearFields();
    if (stayModel.value) {
      return;
    } else {
      backRoute();
    }
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menambahkan pengguna',
      life: 3000,
    });
  }
};
</script>
<template>
  <Card>
    <form class="flex flex-col" @submit.prevent="addUser">
      <div class="grid grid-cols-2 gap-2">
        <div class="pr-4">
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
        <div class="pr-4">
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
            label="Password"
            placeholder="Masukkan password"
          />
        </div>
        <div class="flex flex-col gap-2 pr-4">
          <Dropdown
            v-model:model-value="roleModel"
            label="Role"
            :options="dropdownOptions"
            @open="getRole"
          />
          <FileUpload
            v-model:model-value="photoModel"
            :mandatory="false"
            label="Foto"
            @upload="photoModel = $event"
          />
        </div>
      </div>
      <div class="flex justify-end pt-8">
        <div class="flex flex-col gap-4 items-end">
          <Checkbox v-model:model-value="stayModel" label="Tetap di sini?" />
          <div class="flex gap-2">
            <button
              type="button"
              @click="backRoute"
              class="text-xs rounded-sm !px-2 !py-1 bg-black text-white hover:bg-black/60 hover:cursor-pointer shadow-md border-1 border-gray-600"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="clearFields"
              class="text-xs rounded-sm !px-2 !py-1 bg-transparent text-red-500 hover:bg-red-500/60 hover:text-white hover:cursor-pointer shadow-md border-1 border-red-500"
            >
              Bersihkan Input
            </button>
            <button
              type="submit"
              class="text-xs rounded-sm !px-2 !py-1 bg-green-400 text-white hover:bg-green-400/60 hover:text-white hover:cursor-pointer shadow-md border-1 border-green-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  </Card>
</template>
