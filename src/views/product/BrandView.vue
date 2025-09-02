<script setup lang="ts">
import type {
  QueryParams,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import DataTable from '@/components/datatable/DataTable.vue';
import type { ApiError, FetchListResponse } from '@/types/api.type';
import BrandService from '@/service/brand.service';
import type { Brand } from '@/types/product.type';
import { computed, ref, watch } from 'vue';
import Dialog from '@/components/dialog/Dialog.vue';
import eventBus from '@/components/event-bus';
import InputText from '@/components/inputtext/InputText.vue';
import { useToast } from 'primevue';
import type { MenuItem } from '@/components/menu/Menu.vue.d';
import type {
  DialogConfirmServerity,
  DialogConfirmState,
} from '@/components/dialogconfirm/DialogConfirm.vue.d';
import { formatDate } from '@/utils/data.utils';
import DialogConfirm from '@/components/dialogconfirm/DialogConfirm.vue';
import ButtonMultiAction from '@/components/buttonmultiaction/ButtonMultiAction.vue';
import type { DialogState } from '@/components/dialog/Dialog.vue.d';
import Button from '@/components/button/Button.vue';
import Card from '@/components/card/Card.vue';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import BrandFilterFields from './brand/BrandFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { getStockAppPermission } from '@/utils/auth.utils';

const dialogState = ref<DialogState>({
  visible: false,
  type: 'add',
  header: '',
  useStay: false,
});

const toast = useToast();
const brandModel = ref<string>();

const selectedData = ref<Brand>();
const selectedDataMulti = ref<Brand[]>([]);
const list = ref<Brand[]>([]);
const isStay = ref<boolean>(false);

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
      visible: getStockAppPermission('brand').update,
      command: () => {
        dialogState.value = {
          visible: true,
          type: 'edit',
          header: 'Edit Merek',
          useStay: false,
        };
        brandModel.value = selectedData.value?.name;
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible: getStockAppPermission('brand').delete,
      command: () => {
        list.value = [selectedData.value as Brand];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Merek',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus merek ini?',
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
      visible: getStockAppPermission('brand').delete,
      danger: true,
      command: () => {
        list.value = selectedDataMulti.value;
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Merek',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus merek ini?',
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
    header: 'Merek',
    field: 'name',
    sortable: true,
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: Brand): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: Brand): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
];

const actionAdd = (): void => {
  dialogState.value = {
    visible: true,
    type: 'add',
    header: 'Tambah Merek',
  };
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<Brand> | undefined> => {
  try {
    const { data } = await BrandService.getBrand(params);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const dialogAction = (payload?: {
  event?: PointerEvent | Event;
  stay: boolean;
}): void => {
  if (dialogState.value.type === 'add') {
    isStay.value = payload?.stay ?? false;
    createBrand();
  } else if (dialogState.value.type === 'edit') {
    updateBrand();
  }
};

const confirmDialogAction = async (): Promise<void> => {
  await deleteBrand(list.value.map((item) => item.id));
};

const clearField = (): void => {
  brandModel.value = undefined;
};

const createBrand = async (): Promise<void> => {
  try {
    if (!brandModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama merek tidak boleh kosong',
        life: 3000,
      });
      return;
    }

    if (brandModel.value.length > 30) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama merek tidak boleh lebih dari 30 karakter',
        life: 3000,
      });
      return;
    }

    const body = {
      name: brandModel.value as string,
    };
    await BrandService.createBrand(body);
    if (isStay.value) {
      dialogState.value.visible = true;
    } else {
      dialogState.value.visible = false;
    }
    clearField();
    selectedData.value = undefined;
    selectedDataMulti.value = [];

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil menambah merek',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-brand',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error creating brand:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menambah merek',
      life: 3000,
    });
  }
};

const updateBrand = async (): Promise<void> => {
  try {
    if (!brandModel.value || !selectedData.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama merek harus diisi',
        life: 3000,
      });
      return;
    }

    if (brandModel.value.length > 30) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama merek tidak boleh lebih dari 30 karakter',
        life: 3000,
      });
      return;
    }

    await BrandService.updateBrand(selectedData.value.id, {
      name: brandModel.value,
    });

    clearField();
    dialogState.value.visible = false;
    selectedData.value = undefined;
    selectedDataMulti.value = [];

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil mengubah merek',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-brand',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error updating brand:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal mengubah merek',
      life: 3000,
    });
  }
};

const deleteBrand = async (ids: number[]): Promise<void> => {
  try {
    const body = {
      id: ids,
    };
    await BrandService.deleteBrand(body);
    dialogConfirmState.value.visible = false;

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil menghapus merek',
      life: 3000,
    });

    selectedData.value = undefined;
    selectedDataMulti.value = [];

    eventBus.emit('data-table:update', {
      tableName: 'table-brand',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error deleting brand:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menghapus merek',
      life: 3000,
    });
  }
};

watch(
  () => dialogState.value.visible,
  () => {
    if (!dialogState.value.visible) {
      clearField();
      selectedData.value = undefined;
      selectedDataMulti.value = [];
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
            table-name="table-brand"
          />
          <div class="w-full flex justify-end gap-2">
            <ButtonSearch table-name="table-brand" />
            <ButtonFilter table-name="table-brand" />
            <Button
              v-if="getStockAppPermission('brand').create"
              @click="actionAdd"
              label="Tambah Merek"
              severity="primary"
              class="text-xs"
            />
          </div>
        </div>

        <BrandFilterFields table-name="table-brand" />

        <DataTable
          data-key="id"
          :fetch-function="tableData"
          :columns="tableColumns"
          :options="menuItems"
          @toggle-option="selectedData = $event as Brand"
          @update:selected-data="selectedDataMulti = $event as Brand[]"
          table-name="table-brand"
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
        v-model="brandModel"
        label="Nama Merek"
        placeholder="Masukkan nama merek"
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
