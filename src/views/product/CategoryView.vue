<script setup lang="ts">
import type {
  QueryParams,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import DataTable from '@/components/datatable/DataTable.vue';
import CategoryService from '@/service/category.service';
import type { ApiError, FetchListResponse } from '@/types/api.type';
import type { ProductCategory } from '@/types/product.type';
import { computed, ref, watch } from 'vue';
import InputText from '@/components/inputtext/InputText.vue';
import Dialog from '@/components/dialog/Dialog.vue';
import eventBus from '@/components/event-bus';
import ButtonMultiAction from '@/components/buttonmultiaction/ButtonMultiAction.vue';
import { useToast } from 'primevue';
import DialogConfirm from '@/components/dialogconfirm/DialogConfirm.vue';
import type {
  DialogConfirmServerity,
  DialogConfirmState,
} from '@/components/dialogconfirm/DialogConfirm.vue.d';
import { formatDate } from '@/utils/data.utils';
import type { MenuItem } from '@/components/menu/Menu.vue.d';
import Button from '@/components/button/Button.vue';
import type { DialogState } from '@/components/dialog/Dialog.vue.d';
import Card from '@/components/card/Card.vue';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import CategoryFilterFields from './category/CategoryFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { getStockAppPermission } from '@/utils/auth.utils';

const dialogState = ref<DialogState>({
  visible: false,
  type: 'add',
  header: 'Tambah Kategori',
  useStay: false,
});

const toast = useToast();

const categoryModel = ref<string>();
const selectedData = ref<ProductCategory>();
const selectedDataMulti = ref<ProductCategory[]>([]);
const dialogConfirmState = ref<DialogConfirmState>({
  visible: false,
  header: '',
  severity: 'success' as DialogConfirmServerity,
  confirmButtonSeverity: 'success' as DialogConfirmServerity,
});
const list = ref<ProductCategory[]>([]);
const isStay = ref<boolean>(false);

const menuItems = computed((): MenuItem[] => {
  return [
    {
      label: 'Edit',
      icon: 'edit',
      visible: getStockAppPermission('category').update,
      command: () => {
        selectedDataMulti.value = [];
        dialogState.value = {
          visible: true,
          type: 'edit',
          header: 'Edit Kategori',
          useStay: false,
        };
        categoryModel.value = selectedData.value?.name;
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible: getStockAppPermission('category').delete,
      command: () => {
        selectedDataMulti.value = [];
        list.value = [selectedData.value as ProductCategory];
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

const multiAction = computed((): MenuItem[] => {
  return [
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible: getStockAppPermission('category').delete,
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
    header: 'Kategori',
    field: 'name',
    sortable: true,
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: ProductCategory): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: ProductCategory): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
];

const actionAdd = (): void => {
  selectedData.value = undefined;
  selectedDataMulti.value = [];
  dialogState.value = {
    visible: true,
    type: 'add',
    header: 'Tambah Kategori',
    useStay: true,
  };
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<ProductCategory> | undefined> => {
  try {
    const { data } = await CategoryService.getCategory(params);
    return data;
  } catch (error) {
    console.error('Error fetching category data:', error);
  }
};

const dialogAction = (payload?: {
  event?: PointerEvent | Event;
  stay: boolean;
}): void => {
  if (dialogState.value.type === 'add') {
    isStay.value = payload?.stay ?? false;
    createCategory();
  } else if (dialogState.value.type === 'edit') {
    updateCategory();
  }
};

const confirmDialogAction = async (): Promise<void> => {
  await deleteCategory(list.value.map((item) => item.id));
};

const createCategory = async (): Promise<void> => {
  try {
    if (!categoryModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Kategori tidak boleh kosong',
        life: 3000,
      });
      return;
    }

    if (categoryModel.value.length > 100) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama kategori tidak boleh lebih dari 100 karakter',
        life: 3000,
      });
      return;
    }
    await CategoryService.createCategory({ name: categoryModel.value });
    categoryModel.value = '';
    dialogState.value.visible = false;
    if (isStay.value) {
      dialogState.value.visible = true;
    } else {
      dialogState.value.visible = false;
    }

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil menambah kategori',
      life: 3000,
    });

    selectedData.value = undefined;
    selectedDataMulti.value = [];

    eventBus.emit('data-table:update', {
      tableName: 'table-category',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error creating category:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menambah kategori',
      life: 3000,
    });
  }
};

const updateCategory = async (): Promise<void> => {
  try {
    if (!selectedData.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada kategori yang dipilih untuk diubah',
        life: 3000,
      });
      return;
    }

    if (!categoryModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Kategori tidak boleh kosong',
        life: 3000,
      });
      return;
    }

    if (categoryModel.value.length > 100) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama kategori tidak boleh lebih dari 100 karakter',
        life: 3000,
      });
      return;
    }

    await CategoryService.editCategory(selectedData.value?.id, {
      name: categoryModel.value as string,
    });

    dialogState.value.visible = false;

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil mengubah kategori',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-category',
    });

    selectedData.value = undefined;
    selectedDataMulti.value = [];
  } catch (error: ApiError | unknown) {
    console.error('Error updating category:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal mengubah kategori',
      life: 3000,
    });
  }
};

const deleteCategory = async (id: number[]): Promise<void> => {
  try {
    if (id.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada kategori yang dipilih untuk dihapus',
        life: 3000,
      });
      return;
    }
    const body = {
      id: id,
    };
    await CategoryService.deleteCategory(body);
    dialogConfirmState.value.visible = false;

    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Berhasil menghapus kategori',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-category',
    });

    selectedData.value = undefined;
    selectedDataMulti.value = [];
  } catch (error: ApiError | unknown) {
    console.error('Error deleting category:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menghapus kategori',
      life: 3000,
    });
  }
};

const clearField = (): void => {
  categoryModel.value = undefined;
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
  <Card>
    <div class="flex flex-col gap-2 text-black">
      <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-start gap-2">
          <ButtonMultiAction
            v-model:selected-data="selectedDataMulti"
            :options="multiAction"
            table-name="table-category"
          />
          <div class="w-full flex justify-end gap-2">
            <ButtonSearch table-name="table-category" />
            <ButtonFilter table-name="table-category" />
            <Button
              v-if="getStockAppPermission('category').create"
              @click="actionAdd"
              label="Tambah Kategori"
              severity="primary"
              class="text-xs"
            />
          </div>
        </div>

        <CategoryFilterFields table-name="table-category" />

        <DataTable
          data-key="id"
          :fetch-function="tableData"
          :columns="tableColumns"
          :options="menuItems"
          @toggle-option="selectedData = $event as ProductCategory"
          @update:selected-data="
            selectedDataMulti = $event as ProductCategory[]
          "
          table-name="table-category"
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
        v-model="categoryModel"
        label="Kategori"
        placeholder="Masukkan kategori"
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
