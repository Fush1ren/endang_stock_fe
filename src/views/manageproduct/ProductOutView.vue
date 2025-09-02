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
import type { StockOut } from '@/types/stock.type';
import { formatDate } from '@/utils/data.utils';
import type {
  QueryParams,
  TableCellComponent,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import type { MenuItem } from '@/components/menu/Menu.vue.d';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue';
import type { ApiError, FetchListResponse } from '@/types/api.type';
import StockService from '@/service/stock.service';
import type { MultiRowAttribute } from '@/components/multirow/MultiRow.vue.d';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import ProductOutFilterFields from './productOut/ProductOutFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import eventBus from '@/components/event-bus';
import Badge from '@/components/badge/Badge.vue';
import type { BadgeSeverity } from '@/components/badge/Badge.vue.d';
import { getStockAppPermission } from '@/utils/auth.utils';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const selectedData = ref<StockOut>();
const selectedDataMulti = ref<StockOut[]>([]);
const list = ref<StockOut[]>([]);

const dialogConfirmState = ref<DialogConfirmState>({
  visible: false,
  header: '',
  severity: 'success' as DialogConfirmServerity,
  confirmButtonSeverity: 'success' as DialogConfirmServerity,
});

const menuItems = computed((): MenuItem[] => {
  return [
    {
      label: 'Edit',
      icon: 'edit',
      visible:
        selectedData?.value?.status !== 'completed' &&
        getStockAppPermission('product_out').update,
      command: () => {
        const data = {
          id: selectedData?.value?.id as number,
          fromStoreId: selectedData?.value?.fromStore?.id as number,
        };
        sessionStorage.setItem('productOut', JSON.stringify(data));
        router.push('/manage-product/product-out/edit');
      },
    },
    {
      label: 'Tandai Selesai',
      icon: 'check',
      visible:
        selectedData?.value?.status !== 'completed' &&
        getStockAppPermission('product_out').update,
      command: () => {
        list.value = [selectedData.value as StockOut];
        dialogConfirmState.value = {
          visible: true,
          header: 'Tandai Barang Keluar Selesai',
          severity: 'success',
          confirmButtonSeverity: 'success',
          message:
            'Apakah kamu yakin ingin menandai barang keluar ini sebagai selesai?',
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
        getStockAppPermission('product_out').delete,
      command: () => {
        list.value = [selectedData.value as StockOut];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Barang Keluar',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus barang keluar ini?',
          list: list.value.map((item) => item.transactionCode),
          confirmLabel: 'Hapus',
          actionable: true,
        };
      },
    },
  ];
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
    bodyTemplate: (rowData: StockOut): string => {
      return rowData.date ? formatDate(new Date(rowData.date)) : '-';
    },
  },
  {
    header: 'Status',
    field: 'status',
    sortable: true,
    bodyComponent: (rowData: StockOut): TableCellComponent => {
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
      fieldAttributes: (data: StockOut): MultiRowAttribute[] => {
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
      fieldAttributes: (data: StockOut): MultiRowAttribute[] => {
        return data?.products?.map((item) => {
          return {
            value: `${item.quantity}`,
          };
        });
      },
    },
  },
  {
    header: 'Sumber Barang',
    field: 'fromStore.name',
    sortable: true,
    bodyTemplate: (rowData: StockOut): string => {
      return rowData.fromStore ? rowData.fromStore.name : 'Gudang';
    },
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: StockOut): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: StockOut): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
  {
    field: 'user.name',
    header: 'Dibuat Oleh',
    sortable: true,
    bodyTemplate: (rowData: StockOut): string => {
      return rowData.user ? rowData.user.name : '-';
    },
  },
];

const productOutRoute = computed((): string => {
  const r = route.path.split('/').pop() as string;
  return r;
});

const actionAdd = (): void => {
  router.push('/manage-product/product-out/add');
};

const confirmDialogAction = async (): Promise<void> => {
  if (dialogConfirmState.value.header === 'Hapus Barang Keluar') {
    await deleteProducOut();
  } else if (
    dialogConfirmState.value.header === 'Tandai Barang Keluar Selesai'
  ) {
    await verifyStockOut();
  }
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<StockOut> | undefined> => {
  try {
    const { data } = await StockService.getStockOut(params);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const verifyStockOut = async (): Promise<void> => {
  try {
    if (!selectedData.value?.id) {
      toast.add({
        severity: 'error',
        summary: 'Gagal',
        detail: 'ID barang keluar tidak ditemukan.',
        life: 3000,
      });
      return;
    }

    await StockService.patchStockOut(selectedData?.value?.id as number);
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Barang keluar berhasil ditandai sebagai selesai.',
      life: 3000,
    });
    dialogConfirmState.value.visible = false;
    selectedData.value = undefined; // Clear selected data after verification
    eventBus.emit('data-table:update', {
      tableName: 'table-product-out',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error verifying stock out:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menandai barang keluar.',
      life: 3000,
    });
  }
};

const deleteProducOut = async (): Promise<void> => {
  try {
    if (!selectedData.value?.id) {
      toast.add({
        severity: 'error',
        summary: 'Gagal',
        detail: 'ID barang Keluar tidak ditemukan.',
        life: 3000,
      });
      return;
    }

    await StockService.deleteStockOut(selectedData?.value?.id as number);
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Barang Keluar berhasil dihapus.',
      life: 3000,
    });
    dialogConfirmState.value.visible = false;
    selectedData.value = undefined; // Clear selected data after deletion
    eventBus.emit('data-table:update', {
      tableName: 'table-product-out',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error deleting product out:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menghapus barang keluar.',
      life: 3000,
    });
  }
};
</script>

<template>
  <template v-if="productOutRoute === 'add' || productOutRoute === 'edit'">
    <router-view />
  </template>
  <template v-else>
    <Card>
      <div class="flex flex-col gap-2 text-black">
        <div class="flex flex-col gap-2">
          <div class="flex flex-row justify-start gap-2">
            <div class="w-full flex justify-end gap-2">
              <ButtonSearch table-name="table-product-out" />
              <ButtonFilter table-name="table-product-out" />

              <Button
                v-if="getStockAppPermission('product_out').create"
                @click="actionAdd"
                label="Tambah Barang Keluar"
                severity="primary"
                class="text-xs"
              />
            </div>
          </div>

          <ProductOutFilterFields table-name="table-product-out" />

          <DataTable
            data-key="id"
            :fetch-function="tableData"
            :columns="tableColumns"
            :options="menuItems"
            @toggle-option="selectedData = $event as StockOut"
            @update:selected-data="selectedDataMulti = $event as StockOut[]"
            table-name="table-product-out"
            selection-type="single"
            use-options
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
