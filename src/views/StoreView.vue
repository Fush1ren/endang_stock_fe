<script setup lang="ts">
import type {
  QueryParams,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import DataTable from '@/components/datatable/DataTable.vue';
import type { ApiError, FetchListResponse } from '@/types/api.type';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import type { BreadcrumbMenu } from '@/components/breadcrumb/Breadcrumb.vue.d';
import StoreService from '@/service/store.service';
import type { Store } from '@/types/store.type';
import ButtonMultiAction from '@/components/buttonmultiaction/ButtonMultiAction.vue';
import Button from '@/components/button/Button.vue';
import Dialog from '@/components/dialog/Dialog.vue';
import DialogConfirm from '@/components/dialogconfirm/DialogConfirm.vue';
import InputText from '@/components/inputtext/InputText.vue';
import type { DialogState } from '@/components/dialog/Dialog.vue.d';
import { computed, ref, watch } from 'vue';
import type { MenuItem } from 'primevue/menuitem';
import type { DialogConfirmState } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import type { DialogConfirmServerity } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import { useToast } from 'primevue';
import eventBus from '@/components/event-bus';
import { formatDate } from '@/utils/data.utils';
import Card from '@/components/card/Card.vue';
import { useRoute, useRouter } from 'vue-router';
import ButtonFilter from '../components/buttonfilter/ButtonFilter.vue';
import StoreFilterFields from './store/StoreFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { getStockAppPermission } from '@/utils/auth.utils';

const dialogState = ref<DialogState>({
  visible: false,
  type: 'add',
  header: 'Tambah Kategori',
  useStay: false,
});

const router = useRouter();
const route = useRoute();
const toast = useToast();

const isStay = ref<boolean>(false);
const storeModel = ref<string>();
const selectedData = ref<Store>();
const selectedDataMulti = ref<Store[]>([]);
const dialogConfirmState = ref<DialogConfirmState>({
  visible: false,
  header: '',
  severity: 'success' as DialogConfirmServerity,
  confirmButtonSeverity: 'success' as DialogConfirmServerity,
});
const list = ref<Store[]>([]);

const menuItems = computed((): MenuItem[] => {
  return [
    {
      label: 'Stock',
      icon: 'box-3',
      visible: getStockAppPermission('store_stock').view,
      command: () => {
        sessionStorage.setItem('store', String(selectedData.value?.id));
        router.push('/store/stock');
      },
    },
    {
      label: 'Edit',
      icon: 'edit',
      visible: getStockAppPermission('store').update,
      command: () => {
        dialogState.value = {
          visible: true,
          type: 'edit',
          header: 'Edit Toko',
          useStay: false,
        };
        storeModel.value = selectedData.value?.name;
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible: getStockAppPermission('store').delete,
      command: () => {
        list.value = [selectedData.value as Store];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Toko',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus toko ini?',
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
      visible: getStockAppPermission('store').delete,
      command: () => {
        list.value = selectedDataMulti.value;
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Kategori',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus kategori ini?',
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
    header: 'Toko',
    field: 'name',
    sortable: true,
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: Store): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: Store): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
];

const breadcrumbMenus = computed((): BreadcrumbMenu[] => {
  let routeList: BreadcrumbMenu[] = [
    {
      name: 'Toko',
      route: '/store',
    },
  ];
  if (storeRoute.value === 'stock') {
    routeList = [
      ...routeList,
      {
        name: 'Stock',
        route: '/store/stock',
      },
    ];
  }
  return routeList;
});

const storeRoute = computed((): string => {
  const r = route.path.split('/').pop() as string;
  return r;
});

const actionAdd = (): void => {
  dialogState.value = {
    visible: true,
    type: 'add',
    header: 'Tambah Toko',
    useStay: true,
  };
};

const dialogAction = (payload?: {
  event?: PointerEvent | Event;
  stay: boolean;
}): void => {
  if (dialogState.value.type === 'add') {
    isStay.value = payload?.stay ?? false;
    createStore();
  } else if (dialogState.value.type === 'edit') {
    updateStore();
  }
};

const confirmDialogAction = async (): Promise<void> => {
  await deleteStore(list.value.map((item) => item.id));
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<Store> | undefined> => {
  try {
    const { data } = await StoreService.getStore(params);
    return data;
  } catch (error) {
    console.error('Error fetching store data:', error);
  }
};

const createStore = async (): Promise<void> => {
  try {
    if (!storeModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama toko harus diisi',
        life: 3000,
      });
      return;
    }

    if (storeModel.value.length > 25) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama toko tidak boleh lebih dari 25 karakter',
        life: 3000,
      });
      return;
    }
    await StoreService.createStore({ name: storeModel.value });
    if (isStay.value) {
      dialogState.value.visible = true;
    } else {
      dialogState.value.visible = false;
    }
    clearField();
    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil menambah toko',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-store',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error creating store:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menambah toko',
      life: 3000,
    });
  }
};

const updateStore = async (): Promise<void> => {
  try {
    if (!storeModel.value || !selectedData.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama toko harus diisi',
        life: 3000,
      });
      return;
    }
    if (storeModel.value.length > 25) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama toko tidak boleh lebih dari 25 karakter',
        life: 3000,
      });
      return;
    }
    await StoreService.updateStore(selectedData.value.id, {
      name: storeModel.value,
    });
    dialogState.value.visible = false;
    clearField();

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil mengubah toko',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-store',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error updating store:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal mengubah toko',
      life: 3000,
    });
  }
};

const deleteStore = async (ids: number[]): Promise<void> => {
  try {
    if (ids.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada toko yang dipilih untuk dihapus',
        life: 3000,
      });
      return;
    }
    const body = {
      id: ids,
    };
    await StoreService.deleteStore(body);
    dialogConfirmState.value.visible = false;
    selectedDataMulti.value = [];

    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Berhasil menghapus toko',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-store',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error deleting store:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menghapus toko',
      life: 3000,
    });
  }
};

const clearField = (): void => {
  storeModel.value = undefined;
};

watch(
  () => dialogState.value.visible,
  () => {
    if (!dialogState.value.visible) {
      clearField();
    }
  },
  { immediate: true },
);
</script>
<template>
  <div id="main-view" class="bg-[#eeedf2] w-full overflow-y-hidden">
    <div class="flex flex-col gap-2 p-4">
      <Breadcrumb :menus="breadcrumbMenus" />
      <template v-if="storeRoute === 'stock'">
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
                  table-name="table-store"
                />
                <div class="w-full flex justify-end gap-2">
                  <ButtonSearch table-name="table-store" />
                  <ButtonFilter table-name="table-store" />
                  <Button
                    v-if="getStockAppPermission('store').create"
                    @click="actionAdd"
                    label="Tambah Toko"
                    severity="primary"
                    class="text-xs"
                  />
                </div>
              </div>

              <StoreFilterFields table-name="table-store" />

              <DataTable
                data-key="id"
                :fetch-function="tableData"
                :columns="tableColumns"
                :options="menuItems"
                @toggle-option="selectedData = $event as Store"
                @update:selected-data="selectedDataMulti = $event as Store[]"
                table-name="table-store"
                selection-type="checkbox"
                use-paginator
              />
            </div>
          </div>
        </Card>
        <Dialog
          v-model:visible="dialogState.visible as boolean"
          :header="dialogState?.header"
          class="w-[400px] !bg-white !border-none text-black"
          :use-stay="dialogState?.useStay"
          :use-close="true"
          :closable="false"
          @update:visible="dialogState.visible as boolean"
          @submit="dialogAction"
        >
          <div class="w-full">
            <InputText
              v-model="storeModel"
              label="Nama Toko"
              placeholder="Masukkan nama toko"
            />
          </div>
        </Dialog>
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
    </div>
  </div>
</template>
