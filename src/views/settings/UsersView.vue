<script setup lang="ts">
import type {
  QueryParams,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import DataTable from '@/components/datatable/DataTable.vue';
import UserService from '@/service/user.service';
import type { ApiError, FetchListResponse } from '@/types/api.type';
import type { UserList } from '@/types/user.type';
import { formatDate } from '@/utils/data.utils';
import { computed, ref } from 'vue';
import { useToast } from 'primevue';
import type { DialogConfirmState } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import type { DialogConfirmServerity } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import type { MenuItem } from 'primevue/menuitem';
import Button from '@/components/button/Button.vue';
import ButtonMultiAction from '@/components/buttonmultiaction/ButtonMultiAction.vue';
import DialogConfirm from '@/components/dialogconfirm/DialogConfirm.vue';
import { useRoute, useRouter } from 'vue-router';
import Card from '@/components/card/Card.vue';
import eventBus from '@/components/event-bus';
import UserFilterFields from './user/UserFilterFields.vue';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { getStockAppPermission } from '@/utils/auth.utils';
import type { UserType } from '@/types/storage.type';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const selectedData = ref<UserList>();
const selectedDataMulti = ref<UserList[]>([]);
const list = ref<UserList[]>([]);
const dialogConfirmState = ref<DialogConfirmState>({
  visible: false,
  header: '',
  severity: 'success' as DialogConfirmServerity,
  confirmButtonSeverity: 'success' as DialogConfirmServerity,
});

const menuItems = computed((): MenuItem[] => {
  return [
    {
      label: 'Detail',
      icon: 'file-info',
      visible: getStockAppPermission('setting_user').view,
      command: () => {
        selectedDataMulti.value = [];
        sessionStorage.setItem('users', String(selectedData.value?.id));
        router.push('/settings/users/detail');
      },
    },
    {
      label: 'Edit',
      icon: 'edit',
      visible: getStockAppPermission('setting_user').update,
      command: () => {
        selectedDataMulti.value = [];
        sessionStorage.setItem('users', String(selectedData.value?.id));
        router.push('/settings/users/edit');
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible:
        getStockAppPermission('setting_user').delete && checkUserSingle.value,
      command: () => {
        list.value = [selectedData.value as UserList];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Pengguna',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus pengguna ini?',
          list: list.value.map((item) => item.name),
          confirmLabel: 'Hapus',
          actionable: true,
        };
      },
    },
  ];
});

const checkUserSingle = computed((): boolean => {
  if (!selectedData.value) {
    return false;
  }

  const userData = localStorage.getItem('user');

  if (!userData) {
    return false;
  }
  const data = JSON.parse(userData) as UserType;
  return selectedData.value.id !== data.id;
});

const checkUserMulti = computed((): boolean => {
  if (!selectedDataMulti.value || selectedDataMulti.value.length === 0) {
    return false;
  }

  const userData = localStorage.getItem('user');

  if (!userData) {
    return false;
  }
  const data = JSON.parse(userData) as UserType;
  return !selectedDataMulti.value.some((item) => item.id === data.id);
});

const multiAction = computed((): MenuItem[] => {
  return [
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible:
        getStockAppPermission('setting_user').delete && checkUserMulti.value,
      command: () => {
        list.value = selectedDataMulti.value;
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Pengguna',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus pengguna ini?',
          list: list.value.map((item) => item.name),
          confirmLabel: 'Hapus',
          actionable: true,
        };
      },
    },
  ];
});

const tableColumns: TableColumn[] = [
  {
    header: 'Username',
    field: 'username',
    sortable: true,
  },
  {
    header: 'Nama',
    field: 'name',
    sortable: true,
  },
  {
    header: 'Role',
    field: 'roles.name',
    sortable: true,
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: UserList): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: UserList): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
];

const userRoute = computed((): string => {
  const r = route.path.split('/').pop() as string;
  return r;
});

const actionAdd = (): void => {
  selectedDataMulti.value = [];
  router.push('/settings/users/add');
};

const confirmDialogAction = async (): Promise<void> => {
  await deleteUser(list.value.map((item) => item.id));
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<UserList> | undefined> => {
  try {
    const { data } = await UserService.getUserList(params);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const deleteUser = async (ids: number[]): Promise<void> => {
  try {
    if (ids.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada pengguna yang dipilih untuk dihapus',
        life: 3000,
      });
      return;
    }
    const body = {
      id: ids,
    };
    await UserService.deleteUser(body);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Pengguna berhasil dihapus',
      life: 3000,
    });
    dialogConfirmState.value.visible = false;
    selectedDataMulti.value = [];
    eventBus.emit('data-table:update', {
      tableName: 'table-user',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error deleting user:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menghapus pengguna',
      life: 3000,
    });
  }
};
</script>
<template>
  <template
    v-if="userRoute === 'add' || userRoute === 'edit' || userRoute === 'detail'"
  >
    <router-view />
  </template>
  <template v-else>
    <Card>
      <div class="flex flex-col gap-2 text-black">
        <div class="flex flex-col gap-2">
          <div class="flex flex-row justify-start gap-2">
            <ButtonMultiAction
              v-model:selected-data="selectedDataMulti"
              :options="multiAction"
              table-name="table-user"
            />

            <div class="w-full flex justify-end gap-2">
              <ButtonSearch table-name="table-user" />
              <ButtonFilter table-name="table-user" />

              <Button
                v-if="getStockAppPermission('setting_user').create"
                @click="actionAdd"
                label="Tambah Pengguna"
                severity="primary"
                class="text-xs"
              />
            </div>
          </div>

          <UserFilterFields table-name="table-user" />

          <DataTable
            data-key="id"
            :fetch-function="tableData"
            :columns="tableColumns"
            :options="menuItems"
            @toggle-option="selectedData = $event as UserList"
            @update:selected-data="selectedDataMulti = $event as UserList[]"
            table-name="table-user"
            selection-type="checkbox"
            use-paginator
          />
        </div>
      </div>
    </Card>
    <DialogConfirm
      v-model:visible="dialogConfirmState.visible"
      @confirm="confirmDialogAction"
      :header="dialogConfirmState.header"
      header-icon="check"
      :list="dialogConfirmState.list"
      :message="dialogConfirmState.message"
      :severity="dialogConfirmState.severity"
      :confirm-button-severity="dialogConfirmState.confirmButtonSeverity"
    />
  </template>
</template>
