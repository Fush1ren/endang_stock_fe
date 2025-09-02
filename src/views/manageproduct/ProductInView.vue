<script setup lang="ts">
import Button from '@/components/button/Button.vue';
import Card from '@/components/card/Card.vue';
import DataTable from '@/components/datatable/DataTable.vue';
import type {
  DialogConfirmServerity,
  DialogConfirmState,
} from '@/components/dialogconfirm/DialogConfirm.vue.d';
import DialogConfirm from '@/components/dialogconfirm/DialogConfirm.vue';
import { computed, ref } from 'vue';
import type { StockIn } from '@/types/stock.type';
import { formatDate, getProductPlace } from '@/utils/data.utils';
import type {
  QueryParams,
  TableCellComponent,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import type { MenuItem } from '@/components/menu/Menu.vue.d';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue';
import type { FetchListResponse } from '@/types/api.type';
import StockService from '@/service/stock.service';
import type { MultiRowAttribute } from '@/components/multirow/MultiRow.vue.d';
import ProductInFilterFields from './productIn/ProductInFilterFields.vue';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import type { BadgeSeverity } from '@/components/badge/Badge.vue.d';
import Badge from '@/components/badge/Badge.vue';
import eventBus from '@/components/event-bus';
import { getStockAppPermission } from '@/utils/auth.utils';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const selectedData = ref<StockIn>();
const selectedDataMulti = ref<StockIn[]>([]);
const list = ref<StockIn[]>([]);

const dialogConfirmState = ref<DialogConfirmState>({
  visible: false,
  header: '',
  severity: 'success' as DialogConfirmServerity,
  confirmButtonSeverity: 'success' as DialogConfirmServerity,
});

const getLabelBadge = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Selesai';
    default:
      return 'Pending';
  }
};

const getBadgeSeverity = (status: string): BadgeSeverity => {
  switch (status) {
    case 'completed':
      return 'success';
    default:
      return 'warning';
  }
};

const menuItems = computed((): MenuItem[] => {
  return [
    {
      label: 'Edit',
      icon: 'edit',
      visible:
        selectedData?.value?.status !== 'completed' &&
        getStockAppPermission('product_in').update,
      command: () => {
        sessionStorage.setItem('productIn', String(selectedData.value?.id));
        router.push('/manage-product/product-in/edit');
      },
    },
    {
      label: 'Tandai Selesai',
      icon: 'check',
      visible:
        selectedData?.value?.status !== 'completed' &&
        getStockAppPermission('product_in').update,
      command: () => {
        list.value = [selectedData.value as StockIn];
        dialogConfirmState.value = {
          visible: true,
          header: 'Tandai Barang Masuk Selesai',
          severity: 'success',
          confirmButtonSeverity: 'success',
          message:
            'Apakah kamu yakin ingin menandai barang masuk ini sebagai selesai?',
          list: list.value.map((item) => item.transactionCode),
          confirmLabel: 'Tandai Selesai',
          actionable: true,
        };
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible:
        selectedData?.value?.status !== 'completed' &&
        getStockAppPermission('product_in').delete,
      command: () => {
        list.value = [selectedData.value as StockIn];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Barang Masuk',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus barang masuk ini?',
          list: list.value.map((item) => item.transactionCode),
          confirmLabel: 'Hapus',
          actionable: true,
        };
      },
    },
  ];
});

const tableColumns: TableColumn[] = [
  {
    header: 'Kode Transaksi',
    field: 'transactionCode',
    sortable: true,
  },
  {
    header: 'Tanggal Transaksi',
    field: 'date',
    sortable: true,
    bodyTemplate: (rowData: StockIn): string => {
      return rowData.date ? formatDate(new Date(rowData.date)) : '-';
    },
  },
  {
    header: 'Status',
    field: 'status',
    sortable: true,
    bodyComponent: (rowData: StockIn): TableCellComponent => {
      return {
        component: Badge,
        props: {
          label: getLabelBadge(rowData.status),
          severity: getBadgeSeverity(rowData.status),
        },
      };
    },
  },
  {
    header: 'Barang',
    field: 'product.name',
    sortable: true,
    preset: {
      type: 'multirow',
      fieldAttributes: (data: StockIn): MultiRowAttribute[] => {
        return data?.products?.map((item) => {
          return {
            value: `${item.name}`,
          };
        });
      },
    },
  },
  {
    header: 'Qty',
    field: 'product.quantity',
    sortable: true,
    preset: {
      type: 'multirow',
      fieldAttributes: (data: StockIn): MultiRowAttribute[] => {
        return data?.products?.map((item) => {
          return {
            value: `${item.quantity}`,
          };
        });
      },
    },
  },
  {
    header: 'Masuk Ke',
    field: 'toStore.name',
    sortable: true,
    bodyTemplate: (rowData: StockIn): string => {
      return rowData.toWarehouse !== null
        ? getProductPlace(rowData.toWarehouse, rowData.toStore)
        : '-';
    },
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: StockIn): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: StockIn): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
  {
    field: 'user.name',
    header: 'Dibuat Oleh',
    sortable: true,
    bodyTemplate: (rowData: StockIn): string => {
      return rowData.user ? rowData.user.name : '-';
    },
  },
];

const productInRoute = computed((): string => {
  const r = route.path.split('/').pop() as string;
  return r;
});

const actionAdd = (): void => {
  router.push('/manage-product/product-in/add');
};

const confirmDialogAction = async (): Promise<void> => {
  if (dialogConfirmState.value.header === 'Tandai Barang Masuk Selesai') {
    await verifyProductIn();
  } else if (dialogConfirmState.value.header === 'Hapus Barang Masuk') {
    await deleteProductIn();
  }
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<StockIn> | undefined> => {
  try {
    const { data } = await StockService.getStockIn(params);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const verifyProductIn = async (): Promise<void> => {
  try {
    if (selectedData.value === undefined) {
      toast.add({
        severity: 'warn',
        summary: 'Peringatan',
        detail: 'Tidak ada barang masuk yang dipilih untuk diverifikasi.',
        life: 3000,
      });
      return;
    }
    await StockService.patchStockIn(selectedData?.value.id as number);
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Barang masuk berhasil diverifikasi.',
      life: 3000,
    });
    dialogConfirmState.value.visible = false;

    eventBus.emit('data-table:update', {
      tableName: 'table-product-in',
    });
  } catch (error) {
    console.error('Error verifying product in:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Gagal memverifikasi barang masuk.',
      life: 3000,
    });
  }
};

const deleteProductIn = async (): Promise<void> => {
  try {
    if (selectedData.value === undefined) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada barang masuk yang dipilih untuk dihapus.',
        life: 3000,
      });
      return;
    }

    await StockService.deleteStockIn(selectedData?.value?.id as number);
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Barang masuk berhasil dihapus.',
      life: 3000,
    });
    dialogConfirmState.value.visible = false;
    eventBus.emit('data-table:update', {
      tableName: 'table-product-in',
    });
  } catch (error) {
    console.error('Error deleting product in:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Gagal menghapus barang masuk.',
      life: 3000,
    });
  }
};
</script>

<template>
  <template v-if="productInRoute === 'add' || productInRoute === 'edit'">
    <router-view />
  </template>
  <template v-else>
    <Card>
      <div class="flex flex-col gap-2 text-black">
        <div class="flex flex-col gap-2">
          <div class="flex flex-row justify-start gap-2">
            <div class="w-full flex justify-end gap-2">
              <ButtonSearch table-name="table-product-in" />
              <ButtonFilter table-name="table-product-in" />
              <Button
                v-if="getStockAppPermission('product_in').create"
                @click="actionAdd"
                label="Tambah Barang Masuk"
                severity="primary"
                class="text-xs"
              />
            </div>
          </div>

          <ProductInFilterFields table-name="table-product-in" />

          <DataTable
            data-key="id"
            :fetch-function="tableData"
            :columns="tableColumns"
            :options="menuItems"
            use-options
            @toggle-option="selectedData = $event as StockIn"
            @update:selected-data="selectedDataMulti = $event as StockIn[]"
            table-name="table-product-in"
            selection-type="single"
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
