<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import InputText from '@/components/inputtext/InputText.vue';
import RoleService from '@/service/role.service';
import type { ApiError } from '@/types/api.type';
import type { Permissions } from '@/types/login.type';
import { Divider, ToggleSwitch, useToast } from 'primevue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  getRole();
});

const toast = useToast();
const roleNameModel = ref<string>();
const id = ref<number>();
const rolePermissions = ref<Permissions>({
  setting_user: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  setting_role: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  unit: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  product: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  category: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  brand: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  store: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  store_stock: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  warehouse_stock: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  product_in: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  product_out: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  product_mutation: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
});

const isPermissionAllTrue = computed((): boolean => {
  return Object.values(rolePermissions.value).every(
    (permission) =>
      permission.view &&
      permission.create &&
      permission.update &&
      permission.delete,
  );
});

const clearFields = (): void => {
  roleNameModel.value = undefined;
  rolePermissions.value = {
    setting_user: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    setting_role: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    unit: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    product: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    category: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    brand: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    store: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    store_stock: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    warehouse_stock: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    product_in: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    product_out: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
    product_mutation: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
  };
};

const backRoute = (): void => {
  router.push('/settings/role');
};

const getRole = async (): Promise<void> => {
  try {
    const roleId = sessionStorage.getItem('role');
    if (!roleId) {
      console.error('Role ID not found in session storage');
      return;
    }
    const { data } = await RoleService.getRoleById(Number(roleId));
    id.value = data.data.id;
    roleNameModel.value = data.data.name;
    rolePermissions.value = data.data.permissions as Permissions;
  } catch (error: ApiError | unknown) {
    console.error('Error fetching role:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message ||
          'Gagal mengambil data role'
        : 'Gagal mengambil data role',
      life: 3000,
    });
  }
};

const updateRole = async (): Promise<void> => {
  try {
    if (!roleNameModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama role tidak boleh kosong',
        life: 3000,
      });
      return;
    }

    if (roleNameModel.value?.length > 25) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama role tidak boleh lebih dari 25 karakter',
        life: 3000,
      });
      return;
    }

    if (
      !Object.values(rolePermissions.value).some(
        (permission) =>
          permission.view ||
          permission.create ||
          permission.update ||
          permission.delete,
      )
    ) {
      toast.add({
        severity: 'warn',
        summary: 'Peringatan',
        detail: 'Setidaknya satu perizinan harus diaktifkan',
        life: 3000,
      });
      return;
    }

    if (!id.value) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID role tidak ditemukan',
        life: 3000,
      });
      return;
    }

    await RoleService.updateRole(Number(id.value), {
      name: roleNameModel.value,
      permissions: rolePermissions.value,
    });

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil mengupdate role',
      life: 3000,
    });
    backRoute();
  } catch (error: ApiError | unknown) {
    console.error('Error editing role:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message || 'Gagal mengupdate role'
        : 'Gagal mengupdate role',
      life: 3000,
    });
  }
};

// Select all permissions and set them to true
const selectAllPermissions = (): void => {
  if (isPermissionAllTrue.value) {
    Object.keys(rolePermissions.value).forEach((key) => {
      const permission = rolePermissions.value[key as keyof Permissions];
      if (permission) {
        permission.view = false;
        permission.create = false;
        permission.update = false;
        permission.delete = false;
      }
    });
    return;
  }
  Object.keys(rolePermissions.value).forEach((key) => {
    const permission = rolePermissions.value[key as keyof Permissions];
    if (permission) {
      permission.view = true;
      permission.create = true;
      permission.update = true;
      permission.delete = true;
    }
  });
};

// Change the permissions view type to true if each one permission is set to true
const updatePermissionsView = (): void => {
  Object.keys(rolePermissions.value).forEach((key) => {
    const permission = rolePermissions.value[key as keyof Permissions];
    if (permission) {
      permission.view = Object.values(permission).some((value) => value);
    }
  });
};
// Watch for changes in rolePermissions to update the view permission
watch(rolePermissions, updatePermissionsView, { deep: true });
</script>
<template>
  <Card>
    <form class="flex flex-col p-4 gap-3 text-xs" @submit.prevent="updateRole">
      <div class="w-full grid grid-cols-2">
        <InputText
          v-model:model-value="roleNameModel"
          label="Nama Role"
          placeholder="Masukkan Nama Role"
        />
      </div>
      <div>
        <Divider align="left" type="solid">
          <span class="font-semibold">Perizinan</span>
        </Divider>
        <div class="flex flex-col gap-6">
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Pengaturan Pengguna :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.setting_user.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.setting_user.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.setting_user.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.setting_user.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Pengaturan Hak Akses :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.setting_role.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.setting_role.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.setting_role.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.setting_role.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Produk :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.product.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.product.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.product.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.product.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Merek :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.brand.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.brand.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.brand.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.brand.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Kategori :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.category.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.category.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.category.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.category.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Satuan :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.unit.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.unit.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.unit.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.unit.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Toko :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.store.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.store.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.store.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.store.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Stok Toko :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.store_stock.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.store_stock.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.store_stock.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.store_stock.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Stok Gudang :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.warehouse_stock.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch
                  v-model="rolePermissions.warehouse_stock.create"
                />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch
                  v-model="rolePermissions.warehouse_stock.update"
                />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch
                  v-model="rolePermissions.warehouse_stock.delete"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Barang Masuk :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.product_in.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.product_in.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.product_in.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.product_in.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Barang Keluar :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.product_out.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch v-model="rolePermissions.product_out.create" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch v-model="rolePermissions.product_out.update" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch v-model="rolePermissions.product_out.delete" />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-4 items-center">
            <div class="min-w-[150px]">
              <span>Barang Mutasi :</span>
            </div>
            <div class="flex flex-row gap-8">
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">View</span>
                <ToggleSwitch v-model="rolePermissions.product_mutation.view" />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Create</span>
                <ToggleSwitch
                  v-model="rolePermissions.product_mutation.create"
                />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Update</span>
                <ToggleSwitch
                  v-model="rolePermissions.product_mutation.update"
                />
              </div>
              <div class="flex flex-col items-center gap-1">
                <span class="font-medium">Delete</span>
                <ToggleSwitch
                  v-model="rolePermissions.product_mutation.delete"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          type="button"
          @click="selectAllPermissions"
          class="text-xs text-blue-500 hover:underline hover:cursor-pointer hover:text-blue-700"
        >
          {{ isPermissionAllTrue ? 'Unselect' : 'Select All' }}
        </button>
      </div>
      <div class="flex justify-end pt-8">
        <div class="flex flex-col gap-4 items-end">
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
