<script setup lang="ts">
import type {
  QueryParams,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import DataTable from '@/components/datatable/DataTable.vue';
import type { ApiError, FetchListResponse } from '@/types/api.type';
import ProductService from '@/service/product.service';
import type { Product } from '@/types/product.type';
import Card from '@/components/card/Card.vue';
import Button from '@/components/button/Button.vue';
import ButtonMultiAction from '@/components/buttonmultiaction/ButtonMultiAction.vue';
import { useToast } from 'primevue';
import { useRoute, useRouter } from 'vue-router';
import type { MenuItem } from '@/components/menu/Menu.vue.d';
import { computed, onMounted, ref, watch } from 'vue';
import type { DialogConfirmState } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import type { DialogConfirmServerity } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import DialogConfirm from '@/components/dialogconfirm/DialogConfirm.vue';
import eventBus from '@/components/event-bus';
import { formatDate } from '@/utils/data.utils';
import InputNumber from '@/components/inputnumber/InputNumber.vue';
import type { DialogState } from '@/components/dialog/Dialog.vue.d';
import Dialog from '@/components/dialog/Dialog.vue';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import ProductFilterFields from './product/ProductFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { getStockAppPermission } from '@/utils/auth.utils';
import type { LoginResponse } from '@/types/login.type';

const toast = useToast();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  const user = JSON.parse(
    localStorage.getItem('user') as string,
  ) as LoginResponse;
  userRole.value = user?.role?.name;
});

const dialogState = ref<DialogState>({
  visible: false,
  type: 'add',
  header: 'Tambah Kategori',
  useStay: false,
});

const thresholdModel = ref<number>();
const selectedData = ref<Product>();
const selectedDataMulti = ref<Product[]>([]);
const list = ref<Product[]>([]);
const userRole = ref<string>();

const dialogConfirmState = ref<DialogConfirmState>({
  visible: false,
  header: '',
  severity: 'success' as DialogConfirmServerity,
  confirmButtonSeverity: 'success' as DialogConfirmServerity,
});

const menuItems = computed((): MenuItem[] => {
  return [
    {
      label: 'Edit Produk',
      icon: 'edit',
      visible: getStockAppPermission('product').update,
      command: () => {
        selectedDataMulti.value = [];
        sessionStorage.setItem(
          'product',
          JSON.stringify(selectedData.value?.id),
        );
        router.push('/product/data/edit');
      },
    },
    {
      label: 'Edit Batas Stok',
      icon: 'edit',
      visible: userRole.value?.toLowerCase() === 'owner',
      command: () => {
        thresholdModel.value = selectedData.value?.threshold;
        dialogState.value = {
          visible: true,
          type: 'edit',
          header: 'Edit Batas Stok',
          useStay: false,
        };
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible: getStockAppPermission('product').delete,
      command: () => {
        list.value = [selectedData.value as Product];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Barang',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus Barang ini?',
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
      visible: getStockAppPermission('product').delete,
      danger: true,
      command: () => {
        list.value = selectedDataMulti.value;
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Barang',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus barang ini?',
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
    header: 'Kode Produk',
    field: 'code',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.code ? rowData.code : '-';
    },
  },
  {
    header: 'Nama Produk',
    field: 'name',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.name ? rowData.name : '-';
    },
  },
  {
    header: 'Deskripsi',
    field: 'description',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.description ? rowData.description : '-';
    },
  },
  {
    header: 'Merek',
    field: 'brand.name',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.brand ? rowData.brand.name : '-';
    },
  },
  {
    header: 'Kategori',
    field: 'category.name',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.category ? rowData.category.name : '-';
    },
  },
  {
    header: 'Batas Stok',
    field: 'threshold',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.threshold !== undefined
        ? rowData.threshold.toString()
        : '-';
    },
  },
  {
    header: 'Satuan',
    field: 'unit.name',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.unit ? rowData.unit.name : '-';
    },
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: Product): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
];

const productRoute = computed((): string => {
  const r = route.path.split('/').pop() as string;
  return r;
});

const actionAdd = (): void => {
  selectedData.value = undefined;
  selectedDataMulti.value = [];
  router.push('/product/data/add');
};

const clearField = (): void => {
  thresholdModel.value = undefined;
};

const dialogAction = (_payload?: {
  event?: PointerEvent | Event;
  stay: boolean;
}): void => {
  updateThreshold();
};

const confirmDialogAction = async (): Promise<void> => {
  await deleteProduct(list.value.map((item) => item.id));
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<Product> | undefined> => {
  try {
    const { data } = await ProductService.getProduct(params);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const updateThreshold = async (): Promise<void> => {
  try {
    if (
      thresholdModel.value === undefined ||
      thresholdModel.value === null ||
      thresholdModel.value < 0
    ) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Batas stok tidak boleh kosong',
        life: 3000,
      });
      return;
    }
    const body = {
      threshold: thresholdModel.value,
    };

    await ProductService.updateThreshold(
      selectedData?.value?.id as number,
      body,
    );
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Batas stok berhasil diperbarui',
      life: 3000,
    });
    dialogState.value.visible = false;
    selectedDataMulti.value = [];
    selectedData.value = undefined;

    eventBus.emit('data-table:update', {
      tableName: 'table-product',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error updating threshold:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal memperbarui batas stok',
      life: 3000,
    });
  }
};

const deleteProduct = async (ids: number[]): Promise<void> => {
  try {
    if (ids.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada produk yang dipilih untuk dihapus',
        life: 3000,
      });
      return;
    }
    const body = {
      id: ids,
    };

    await ProductService.deleteProduct(body);
    dialogConfirmState.value.visible = false;
    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Produk berhasil dihapus',
      life: 3000,
    });
    selectedDataMulti.value = [];
    selectedData.value = undefined;

    eventBus.emit('data-table:update', {
      tableName: 'table-product',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error deleting product:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menghapus produk',
      life: 3000,
    });
  }
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
  <template
    v-if="
      productRoute === 'add' ||
      productRoute === 'edit' ||
      productRoute === 'detail'
    "
  >
    <router-view />
  </template>
  <template v-else>
    <Card>
      <div class="flex flex-col gap-2 text-black overflow-x-auto w-full">
        <div class="flex flex-col gap-2">
          <div class="flex flex-row justify-start gap-2">
            <ButtonMultiAction
              v-model:selected-data="selectedDataMulti"
              :options="multiAction"
              table-name="table-product"
            />
            <div class="w-full flex justify-end gap-2">
              <ButtonSearch table-name="table-product" />
              <ButtonFilter table-name="table-product" />
              <Button
                v-if="getStockAppPermission('product').create"
                @click="actionAdd"
                label="Tambah Barang"
                severity="primary"
                class="text-xs"
              />
            </div>
          </div>
          <ProductFilterFields table-name="table-product" />

          <DataTable
            data-key="id"
            :fetch-function="tableData"
            :columns="tableColumns"
            :options="menuItems"
            @toggle-option="selectedData = $event as Product"
            @update:selected-data="selectedDataMulti = $event as Product[]"
            table-name="table-product"
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
      @submit="dialogAction"
    >
      <div class="w-full">
        <InputNumber
          v-model="thresholdModel"
          label="Batas Stok"
          placeholder="Masukkan batas stok"
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
</template>
