<script setup lang="ts">
import type { BadgeSeverity } from '@/components/badge/Badge.vue.d';
import Badge from '@/components/badge/Badge.vue';
import Button from '@/components/button/Button.vue';
import Card from '@/components/card/Card.vue';
import DataTable from '@/components/datatable/DataTable.vue';
import type {
  QueryParams,
  TableCellComponent,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import StockService from '@/service/stock.service';
import StoreService from '@/service/store.service';
import type { FetchListResponse } from '@/types/api.type';
import type { StockWarehouse } from '@/types/stock.type';
import type { Store } from '@/types/store.type';
import { formatDate } from '@/utils/data.utils';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import StoreStockFilterFields from './StoreStockFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { getStockAppPermission } from '@/utils/auth.utils';

onMounted(() => {
  getStore();
});

const router = useRouter();
const toast = useToast();

const store = ref<Store>();
const id = ref<number>();

const tableColumns: TableColumn[] = [
  {
    field: 'product.name',
    header: 'Nama Produk',
    sortable: true,
  },
  {
    field: 'product.brand.name',
    header: 'Merek',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse) => {
      return rowData.product?.brand ? rowData.product?.brand?.name : '-';
    },
  },
  {
    field: 'quantity',
    header: 'Jumlah Stok',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse) => {
      return rowData.quantity !== undefined
        ? rowData.quantity.toLocaleString()
        : '-';
    },
  },
  {
    field: 'status',
    header: 'Status',
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
    field: 'updatedAt',
    header: 'Terakhir Diubah',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse) => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    field: 'createdAt',
    header: 'Tanggal Dibuat',
    sortable: true,
    bodyTemplate: (rowData: StockWarehouse) => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
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

const getStore = async (): Promise<void> => {
  try {
    const storeId = sessionStorage.getItem('store');
    if (!storeId) {
      console.error('Store ID not found in session storage');
      return;
    }
    id.value = Number(storeId);
    const { data } = await StoreService.getStoreById(Number(storeId));
    store.value = data.data;
  } catch (error) {
    console.error('Error fetching store:', error);
  }
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<StockWarehouse> | undefined> => {
  try {
    const storeId = sessionStorage.getItem('store');
    if (!storeId) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Store ID not found in session storage',
        life: 3000,
      });
      return;
    }

    const { data } = await StockService.getStoreStockList(
      params,
      Number(storeId),
    );
    return data;
  } catch (error) {
    console.error('Error fetching store stock:', error);
  }
};
</script>

<template>
  <Card>
    <div class="flex flex-col gap-3 text-black">
      <div class="flex flex-row gap-1 w-fit">
        <span class="text-sm font-semibold">Daftar Stok Pada: </span>
        <span class="text-sm text-center">{{ store?.name }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-start gap-2">
          <div class="w-full flex justify-end gap-2">
            <ButtonSearch table-name="table-store-stock" />
            <ButtonFilter table-name="table-store-stock" />
            <Button
              v-if="getStockAppPermission('product_in').create"
              @click="actionAdd"
              label="Tambah Stock"
              severity="primary"
              class="text-xs"
            />
          </div>
        </div>
        <StoreStockFilterFields
          table-name="table-store-stock"
          :id="id as number"
        />
        <DataTable
          data-key="id"
          :fetch-function="tableData"
          :columns="tableColumns"
          :use-options="false"
          table-name="table-store-stock"
          selection-type="single"
          use-paginator
        />
      </div>
    </div>
  </Card>
</template>
