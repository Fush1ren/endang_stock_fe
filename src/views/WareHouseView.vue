<script setup lang="ts">
import type {
  QueryParams,
  TableCellComponent,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import DataTable from '@/components/datatable/DataTable.vue';
import type { FetchListResponse } from '@/types/api.type';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import type { BreadcrumbMenu } from '@/components/breadcrumb/Breadcrumb.vue.d';
import StoreService from '@/service/store.service';
import type { Store } from '@/types/store.type';
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
import StockService from '@/service/stock.service';
import type { StockWarehouse } from '@/types/stock.type';
import { useRouter } from 'vue-router';
import Badge from '@/components/badge/Badge.vue';
import type { BadgeSeverity } from '@/components/badge/Badge.vue.d';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import WareHouseFilterFields from './warehouse/WareHouseFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { getStockAppPermission } from '@/utils/auth.utils';

const dialogState = ref<DialogState>({
  visible: false,
  type: 'add',
  header: 'Tambah Kategori',
  useStay: false,
});

const router = useRouter();
const toast = useToast();

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
      label: 'Edit',
      icon: 'edit',
      visible: getStockAppPermission('warehouse_stock').update,
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
      visible: getStockAppPermission('warehouse_stock').delete,
      command: () => {
        list.value = [selectedData.value as Store];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Toko',
          severity: 'success',
          confirmButtonSeverity: 'success',
          message: 'Apakah kamu yakin ingin menghapus toko ini?',
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
    header: 'Produk',
    field: 'product.name',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse): string => {
      return rowData.product ? rowData.product.name : '-';
    },
  },
  {
    header: 'Merek',
    field: 'product.brand.name',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse): string => {
      return rowData.product?.brand ? rowData.product?.brand?.name : '-';
    },
  },
  {
    header: 'Jumlah',
    field: 'quantity',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse): string => {
      return rowData.quantity !== undefined ? rowData.quantity.toString() : '-';
    },
  },
  {
    header: 'Status',
    field: 'status',
    sortable: true,
    bodyComponent: (rowData: StockWarehouse): TableCellComponent => {
      return {
        component: Badge,
        props: {
          label:
            getLabelBadge(rowData.status)?.charAt(0).toUpperCase() +
            getLabelBadge(rowData.status)?.slice(1),
          severity: getBadgeSeverity(rowData.status),
        },
      };
    },
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
];

const breadcrumbMenus: BreadcrumbMenu[] = [
  {
    name: 'Gudang',
    route: '/warehouse',
  },
];

const getBadgeSeverity = (status: string): BadgeSeverity => {
  switch (status) {
    case 'outOfStock':
      return 'danger';
    case 'lowStock':
      return 'warning';
    default:
      return 'success';
  }
};

const getLabelBadge = (status: string): string => {
  switch (status) {
    case 'outOfStock':
      return 'Habis';
    case 'lowStock':
      return 'Stok Rendah';
    default:
      return 'Tersedia';
  }
};

const actionAdd = (): void => {
  router.push('/manage-product/product-in/add');
};

const dialogAction = (_payload?: {
  event?: PointerEvent | Event;
  stay: boolean;
}): void => {
  if (dialogState.value.type === 'add') {
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
): Promise<FetchListResponse<StockWarehouse> | undefined> => {
  try {
    const { data } = await StockService.getWarehouseStock(params);
    return data;
  } catch (error) {
    console.error('Error fetching store data:', error);
  }
};

const createStore = async (): Promise<void> => {
  try {
    if (!storeModel.value) return;
    await StoreService.createStore({ name: storeModel.value });
    dialogState.value.visible = false;
    storeModel.value = '';

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil menambah toko',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-store',
    });
  } catch (error) {
    console.error('Error creating store:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Gagal menambah toko',
      life: 3000,
    });
  }
};

const updateStore = async (): Promise<void> => {
  try {
    if (!storeModel.value || !selectedData.value) return;
    await StoreService.updateStore(selectedData.value.id, {
      name: storeModel.value,
    });
    dialogState.value.visible = false;
    storeModel.value = '';

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil mengubah toko',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-store',
    });
  } catch (error) {
    console.error('Error updating store:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Gagal mengubah toko',
      life: 3000,
    });
  }
};

const deleteStore = async (ids: number[]): Promise<void> => {
  try {
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
  } catch (error) {
    console.error('Error deleting store:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Gagal menghapus toko',
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
      <Card>
        <div class="flex flex-col gap-2 text-black">
          <div class="flex flex-col gap-2">
            <div class="flex flex-row justify-start gap-2">
              <div class="w-full flex justify-end gap-2">
                <ButtonSearch table-name="table-warehouse" />
                <ButtonFilter table-name="table-warehouse" />

                <Button
                  v-if="getStockAppPermission('warehouse_stock').create"
                  @click="actionAdd"
                  label="Tambah Stok"
                  severity="primary"
                  class="text-xs"
                />
              </div>
            </div>

            <WareHouseFilterFields table-name="table-warehouse" />

            <DataTable
              data-key="id"
              :fetch-function="tableData"
              :columns="tableColumns"
              :options="menuItems"
              @toggle-option="selectedData = $event as Store"
              @update:selected-data="selectedDataMulti = $event as Store[]"
              table-name="table-warehouse"
              selection-type="single"
              use-paginator
              :use-options="false"
            />
          </div>
        </div>
      </Card>
    </div>
  </div>
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
