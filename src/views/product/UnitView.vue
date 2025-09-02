<script setup lang="ts">
import DataTable from '@/components/datatable/DataTable.vue';
import type {
  QueryParams,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import UnitService from '@/service/unit.service';
import type { ApiError, FetchListResponse } from '@/types/api.type';
import type { UnitProduct } from '@/types/product.type';
import { computed, ref, watch } from 'vue';
import Dialog from '@/components/dialog/Dialog.vue';
import InputText from '@/components/inputtext/InputText.vue';
import eventBus from '@/components/event-bus';
import type { DialogState } from '@/components/dialog/Dialog.vue.d';
import Button from '@/components/button/Button.vue';
import type { MenuItem } from '@/components/menu/Menu.vue.d';
import type { DialogConfirmServerity } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import type { DialogConfirmState } from '@/components/dialogconfirm/DialogConfirm.vue.d';
import { formatDate } from '@/utils/data.utils';
import DialogConfirm from '@/components/dialogconfirm/DialogConfirm.vue';
import { useToast } from 'primevue';
import ButtonMultiAction from '@/components/buttonmultiaction/ButtonMultiAction.vue';
import Card from '@/components/card/Card.vue';
import ButtonFilter from '@/components/buttonfilter/ButtonFilter.vue';
import UnitFilterFields from './unit/UnitFilterFields.vue';
import ButtonSearch from '@/components/buttonsearch/ButtonSearch.vue';
import { getStockAppPermission } from '@/utils/auth.utils';

const dialogState = ref<DialogState>({
  visible: false,
  type: 'add',
  header: 'Tambah Merek',
});

const toast = useToast();

const unitModel = ref<string>();
const selectedData = ref<UnitProduct>();
const selectedDataMulti = ref<UnitProduct[]>([]);
const list = ref<UnitProduct[]>([]);
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
      visible: getStockAppPermission('unit').update,
      command: () => {
        dialogState.value = {
          visible: true,
          type: 'edit',
          header: 'Edit Satuan',
          useStay: false,
        };
        unitModel.value = selectedData.value?.name;
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible: getStockAppPermission('unit').delete,
      command: () => {
        list.value = [selectedData.value as UnitProduct];
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Satuan',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus satuan ini?',
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
      visible: getStockAppPermission('unit').delete,
      command: () => {
        list.value = selectedDataMulti.value;
        dialogConfirmState.value = {
          visible: true,
          header: 'Hapus Satuan',
          severity: 'error',
          confirmButtonSeverity: 'danger',
          message: 'Apakah kamu yakin ingin menghapus unit ini?',
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
    header: 'Satuan',
    field: 'name',
    sortable: true,
  },
  {
    header: 'Terakhir Diubah',
    field: 'updatedAt',
    sortable: true,
    bodyTemplate: (rowData: UnitProduct): string => {
      return rowData.updatedAt ? formatDate(new Date(rowData.updatedAt)) : '-';
    },
  },
  {
    header: 'Dibuat Pada',
    field: 'createdAt',
    sortable: true,
    bodyTemplate: (rowData: UnitProduct): string => {
      return rowData.createdAt ? formatDate(new Date(rowData.createdAt)) : '-';
    },
  },
];

const actionAdd = (): void => {
  dialogState.value = {
    visible: true,
    type: 'add',
    header: 'Tambah Satuan',
  };
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<UnitProduct> | undefined> => {
  try {
    const { data } = await UnitService.getUnit(params);
    return data;
  } catch (error) {
    console.error('Error fetching store data:', error);
  }
};

const dialogAction = (payload?: {
  event?: PointerEvent | Event;
  stay: boolean;
}): void => {
  if (dialogState.value.type === 'add') {
    isStay.value = payload?.stay ?? false;
    createUnit();
  } else if (dialogState.value.type === 'edit') {
    updateUnit();
  }
};

const clearField = (): void => {
  unitModel.value = undefined;
};

const createUnit = async (): Promise<void> => {
  try {
    if (!unitModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama satuan harus diisi',
        life: 3000,
      });
      return;
    }

    if (unitModel.value.length > 25) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama satuan harus kurang dari 25 karakter',
        life: 3000,
      });
      return;
    }

    await UnitService.createUnit({
      name: unitModel.value,
    });

    if (isStay.value) {
      dialogState.value.visible = true;
    } else {
      dialogState.value.visible = false;
    }

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil menambah satuan',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-unit',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error creating unit:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menambah satuan',
      life: 3000,
    });
  }
};

const updateUnit = async (): Promise<void> => {
  try {
    if (!unitModel.value || !selectedData.value?.id) {
      toast.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Nama satuan harus diisi',
        life: 3000,
      });
      return;
    }

    if (unitModel.value.length > 25) {
      toast.add({
        severity: 'error',
        summary: 'Warning',
        detail: 'Nama satuan harus kurang dari 25 karakter',
        life: 3000,
      });
      return;
    }

    await UnitService.editUnit(selectedData.value.id, {
      name: unitModel.value,
    });

    dialogState.value.visible = false;

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Berhasil mengubah satuan',
      life: 3000,
    });

    eventBus.emit('data-table:update', {
      tableName: 'table-unit',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error updating unit:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal mengubah satuan',
      life: 3000,
    });
  }
};

const confirmDialogAction = async (): Promise<void> => {
  await deleteUnit(list.value.map((item) => item.id));
};

const deleteUnit = async (id: number[]): Promise<void> => {
  try {
    const body = {
      id: id,
    };
    await UnitService.deleteUnit(body);
    dialogConfirmState.value.visible = false;

    toast.add({
      severity: 'success',
      summary: 'Berhasil',
      detail: 'Berhasil menghapus satuan',
      life: 3000,
    });
    selectedData.value = undefined;
    selectedDataMulti.value = [];
    eventBus.emit('data-table:update', {
      tableName: 'table-unit',
    });
  } catch (error: ApiError | unknown) {
    console.error('Error deleting unit:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal menghapus satuan',
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
  <Card>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <div class="flex flex-row justify-start gap-2">
          <ButtonMultiAction
            v-model:selected-data="selectedDataMulti"
            :options="multiAction"
            table-name="table-unit"
          />
          <div class="w-full flex justify-end gap-2">
            <ButtonSearch table-name="table-unit" />
            <ButtonFilter table-name="table-unit" />
            <Button
              v-if="getStockAppPermission('unit').create"
              @click="actionAdd"
              label="Tambah Satuan"
              severity="primary"
              class="text-xs"
            />
          </div>
        </div>

        <UnitFilterFields table-name="table-unit" />

        <DataTable
          data-key="id"
          :fetch-function="tableData"
          :columns="tableColumns"
          :options="menuItems"
          @toggle-option="selectedData = $event as UnitProduct"
          @update:selected-data="selectedDataMulti = $event as UnitProduct[]"
          table-name="table-unit"
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
        v-model="unitModel"
        label="Nama Satuan"
        placeholder="Masukkan nama satuan"
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
