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
import type { StockMutation } from '@/types/stock.type';
import { formatDate } from '@/utils/data.utils';
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
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import ProductMutationFilterFields from './productMutation/ProductMutationFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import eventBus from '@/components/event-bus';
import Badge from '@/components/badge/Badge.vue';
import type { BadgeSeverity } from '@/components/badge/Badge.vue.d';
import { getStockAppPermission } from '@/utils/auth.utils';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const selectedData = ref<StockMutation>();
const list = ref<StockMutation[]>([]);

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
        getStockAppPermission('product_mutation').update,
      command: () => {
        const data = {
          id: selectedData.value?.id,
          fromWarehouse: selectedData?.value?.fromWarehouse,
          fromStore: selectedData?.value?.fromStore,
        };
        sessionStorage.setItem('productMutation', JSON.stringify(data));
        router.push('/manage-product/product-mutation/edit');
      },
    },
    {
      label: 'Tandai Selesai',
      icon: 'check',
      visible:
        selectedData?.value?.status !== 'completed' &&
        getStockAppPermission('product_mutation').update,
      command: () => {
        list.value = [selectedData.value as StockMutation];
        dialogConfirmState.value = {
          visible: true,
          header: 'Tandai Barang Mutasi Selesai',
          severity: 'success',
          confirmButtonSeverity: 'success',
          message:
            'Apakah kamu yakin ingin menandai barang mutasi ini sebagai selesai?',
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
        getStockAppPermission('product_mutation').delete,
      command: () => {
        list.value = [selectedData.value as StockMutation];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Barang Mutasi',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus barang mustasi ini?',
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
    bodyTemplate: (rowData: StockMutation): string => {
      return rowData.date ? formatDate(new Date(rowData.date)) : '-';
    },
  },
  {
    header: 'Status',
    field: 'status',
    sortable: true,
    bodyComponent: (rowData: StockMutation): TableCellComponent => {
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
      fieldAttributes: (data: StockMutation): MultiRowAttribute[] => {
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
      fieldAttributes: (data: StockMutation): MultiRowAttribute[] => {
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
    bodyTemplate: (rowData: StockMutation): string => {
      return rowData.fromStore ? rowData.fromStore.name : 'Gudang';
    },
  },
  {
    header: 'Tujuan Barang',
    field: 'toStore.name',
    sortable: true,
    bodyTemplate: (rowData: StockMutation): string => {
      return rowData.toStore ? rowData.toStore.name : 'Gudang';
    },
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: StockMutation): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: StockMutation): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
  {
    field: 'user.name',
    header: 'Dibuat Oleh',
    sortable: true,
    bodyTemplate: (rowData: StockMutation): string => {
      return rowData.user ? rowData.user.name : '-';
    },
  },
];

const productMutationRoute = computed((): string => {
  const r = route.path.split('/').pop() as string;
  return r;
});

const actionAdd = (): void => {
  router.push('/manage-product/product-mutation/add');
};

const confirmDialogAction = async (): Promise<void> => {
  if (dialogConfirmState.value.header === 'Tandai Barang Mutasi Selesai') {
    await verifyMutationStock();
  } else if (dialogConfirmState.value.header === 'Hapus Barang Mutasi') {
    await deleteProductMutation();
  }
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<StockMutation> | undefined> => {
  try {
    const { data } = await StockService.getStockMutation(params);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const verifyMutationStock = async (): Promise<void> => {
  try {
    if (selectedData.value?.id === undefined) {
      toast.add({
        severity: 'error',
        summary: 'Gagal',
        detail: 'Tidak ada barang mutasi yang dipilih.',
        life: 3000,
      });
      return;
    }

    await StockService.patchStockMutation(selectedData.value.id as number);
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Barang mutasi berhasil diverifikasi.',
      life: 3000,
    });
    dialogConfirmState.value.visible = false;
    selectedData.value = undefined;
    list.value = [];
    eventBus.emit('data-table:update', {
      tableName: 'table-product-mutation',
    });
  } catch (error) {
    console.error('Error verifying mutation stock:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Gagal memverifikasi barang mutasi.',
      life: 3000,
    });
  }
};

const deleteProductMutation = async (): Promise<void> => {
  try {
    if (selectedData.value?.id === undefined) {
      toast.add({
        severity: 'error',
        summary: 'Gagal',
        detail: 'Tidak ada barang mutation yang dipilih.',
        life: 3000,
      });
      return;
    }

    await StockService.deleteStockMutation(selectedData.value.id as number);
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Barang mutasi berhasil dihapus.',
      life: 3000,
    });
    dialogConfirmState.value.visible = false;
    selectedData.value = undefined;
    list.value = [];
    eventBus.emit('data-table:update', {
      tableName: 'table-product-mutation',
    });
  } catch (error) {
    console.error('Error deleting product mutation:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: 'Gagal menghapus barang mutasi.',
      life: 3000,
    });
  }
};
</script>

<template>
  <template
    v-if="productMutationRoute === 'add' || productMutationRoute === 'edit'"
  >
    <router-view />
  </template>
  <template v-else>
    <Card>
      <div class="flex flex-col gap-2 text-black">
        <div class="flex flex-col gap-2">
          <div class="flex flex-row justify-start gap-2">
            <div class="w-full flex justify-end gap-2">
              <ButtonSearch table-name="table-product-mutation" />
              <ButtonFilter table-name="table-product-mutation" />
              <Button
                v-if="getStockAppPermission('product_mutation').create"
                @click="actionAdd"
                label="Tambah Barang Mutasi"
                severity="primary"
                class="text-xs"
              />
            </div>
          </div>

          <ProductMutationFilterFields table-name="table-product-mutation" />

          <DataTable
            data-key="id"
            :fetch-function="tableData"
            :columns="tableColumns"
            :options="menuItems"
            @toggle-option="selectedData = $event as StockMutation"
            table-name="table-product-mutation"
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
