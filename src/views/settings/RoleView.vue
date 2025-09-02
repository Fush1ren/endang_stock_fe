<script setup lang="ts">
import type {
  QueryParams,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import DataTable from '@/components/datatable/DataTable.vue';
import type { ApiError, FetchListResponse } from '@/types/api.type';
import RoleService from '@/service/role.service';
import type { Role } from '@/types/role.type';
import { formatDate } from '@/utils/data.utils';
import DialogConfirm from '@/components/dialogconfirm/DialogConfirm.vue';
import { computed, ref } from 'vue';
import type { MenuItem } from '@/components/menu/Menu.vue.d';
import type { DialogConfirmState } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import type { DialogConfirmServerity } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import { useToast } from 'primevue';
import eventBus from '@/components/event-bus';
import Button from '@/components/button/Button.vue';
import ButtonMultiAction from '@/components/buttonmultiaction/ButtonMultiAction.vue';
import Card from '@/components/card/Card.vue';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import RoleFilterFields from './role/RoleFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { useRoute, useRouter } from 'vue-router';
import { getStockAppPermission } from '@/utils/auth.utils';

const router = useRouter();
const route = useRoute();

const toast = useToast();
const selectedData = ref<Role>();
const selectedDataMulti = ref<Role[]>([]);
const dialogConfirmState = ref<DialogConfirmState>({
  visible: false,
  header: '',
  severity: 'success' as DialogConfirmServerity,
  confirmButtonSeverity: 'success' as DialogConfirmServerity,
});

const list = ref<Role[]>([]);

const roleRoute = computed((): string => {
  const r = route.path.split('/').pop() as string;
  return r;
});

const menuItems = computed((): MenuItem[] => {
  return [
    {
      label: 'Edit',
      icon: 'edit',
      visible: getStockAppPermission('setting_role').update,
      command: () => {
        sessionStorage.setItem('role', JSON.stringify(selectedData.value?.id));
        router.push('/settings/role/edit');
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible: getStockAppPermission('setting_role').delete,
      command: () => {
        list.value = [selectedData.value as Role];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Role',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus role ini?',
          list: list.value.map((item) => item.name),
          confirmLabel: 'Hapus',
          actionable: true,
        };
      },
    },
  ];
});

const multiAction = computed((): MenuItem[] => {
  return [
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible: getStockAppPermission('setting_role').delete,
      command: () => {
        list.value = selectedDataMulti.value;
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Role',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus role ini?',
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
    header: 'Nama Role',
    field: 'name',
    sortable: true,
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: Role): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData?.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: Role): string => {
      return rowData.createdAt ? formatDate(new Date(rowData?.createdAt)) : '-';
    },
  },
];

const actionAdd = (): void => {
  router.push('/settings/role/add');
};

const confirmDialogAction = async (): Promise<void> => {
  await deleteRole(list.value.map((item) => item.id));
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<Role> | undefined> => {
  try {
    const { data } = await RoleService.getRole(params);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const deleteRole = async (ids: number[]): Promise<void> => {
  try {
    const body = {
      id: ids,
    };
    await RoleService.deleteRole(body);
    dialogConfirmState.value.visible = false;

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil menghapus role',
      life: 3000,
    });

    selectedDataMulti.value = [];
    selectedData.value = undefined;

    eventBus.emit('data-table:update', {
      tableName: 'table-role',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error deleting role:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menghapus role',
      life: 3000,
    });
  }
};
</script>
<template>
  <template v-if="roleRoute === 'add' || roleRoute === 'edit'">
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
              table-name="table-role"
            />
            <div class="w-full flex justify-end gap-2">
              <ButtonSearch table-name="table-role" />
              <ButtonFilter table-name="table-role" />

              <Button
                v-if="getStockAppPermission('setting_role').create"
                @click="actionAdd"
                label="Tambah Role"
                severity="primary"
                class="text-xs"
              />
            </div>
          </div>

          <RoleFilterFields table-name="table-role" />

          <DataTable
            data-key="id"
            :fetch-function="tableData"
            :columns="tableColumns"
            :options="menuItems"
            @toggle-option="selectedData = $event as Role"
            @update:selected-data="selectedDataMulti = $event as Role[]"
            table-name="table-role"
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
