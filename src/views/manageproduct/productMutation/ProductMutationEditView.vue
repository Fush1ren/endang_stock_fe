<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import DatePicker from '@/components/datepicker/DatePicker.vue';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import type { DropdownOption } from '@/components/dropdown/Dropdown.vue.d';
import InputNumber from '@/components/inputnumber/InputNumber.vue';
import InputText from '@/components/inputtext/InputText.vue';
import StockService from '@/service/stock.service';
import type { ApiError } from '@/types/api.type';
import type { StockMutation } from '@/types/stock.type';
// import type {
//   StockMutation,
//   StockWarehouse,
//   StockWareHouseDropdown,
// } from '@/types/stock.type';
import { generateTransactionCodeMutation } from '@/utils/data.utils';
import { RadioButton, useToast } from 'primevue';
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const transactionCode = ref<string>();
const transactionDate = ref<Date>();
const fromStoreModel = ref<DropdownOption>();
const toStoreModel = ref<DropdownOption>();
const productModel = ref<DropdownOption[]>([]);
const quantityModel = ref<number[]>([]);
const totalProductFields = shallowRef<number>(0);
const transactionCodeIndex = ref<number>(0);
// const stockStore = ref<StockWarehouse[]>([]);
// const stockWarehouse = ref<StockWareHouseDropdown[]>([]);
const quantitySelected = ref<number[]>([]);
const isWarehouseModel = ref<'warehouse' | 'store'>();
const productMutationData = ref<StockMutation>();

onMounted(() => {
  const editData = JSON.parse(
    sessionStorage.getItem('productMutation') || '{}',
  ) as {
    id: number;
    fromWarehouse: boolean;
    fromStore?: { id_store: number; name: string } | null;
  };
  getProductMutation(editData?.id);
  // if (editData?.fromWarehouse) {
  //   getWareHouseStock();
  // } else {
  //   getStoreStock();
  // }
});

const clearFields = (): void => {
  quantityModel.value = [];
  transactionDate.value = undefined;
};

const backRoute = (): void => {
  // Logic to navigate back goes here
  router.back();
};

const setTransactionCode = (): void => {
  transactionCode.value = generateTransactionCodeMutation(
    transactionCodeIndex.value,
  );
};

const getProductInIndex = async (): Promise<void> => {
  try {
    const { data } = await StockService.getStockMutationIndex();
    transactionCodeIndex.value = data.data.nextCode;
    setTransactionCode();
  } catch (error) {
    console.error('Error fetching stock in index:', error);
  }
};

const getProductMutation = async (id: number): Promise<void> => {
  try {
    if (!id) {
      console.error('Product mutation ID is required');
      return;
    }
    const { data } = await StockService.getStockMutationById(id);
    productMutationData.value = data.data;
    transactionCode.value = data.data.transactionCode;
    transactionDate.value = new Date(data.data.date);
    isWarehouseModel.value = data.data.fromWarehouse ? 'warehouse' : 'store';
    fromStoreModel.value = data.data.fromStore
      ? { id: data.data.fromStore.id_store, name: data.data.fromStore.name }
      : undefined;
    toStoreModel.value = data.data.toStore
      ? { id: data.data.toStore.id, name: data.data.toStore.name }
      : undefined;
    data.data.products.forEach((product) => {
      productModel.value.push({
        id: product.id,
        name: product.name,
      });
      quantityModel.value.push(product.quantity);
    });
    totalProductFields.value = data.data.products.length;

    if (data?.data?.fromWarehouse) {
      getWareHouseStock();
    } else {
      getStoreStock(data?.data?.fromStore?.id_store as number);
    }
  } catch (error) {
    console.error('Error fetching product mutation:', error);
  }
};

const getWareHouseStock = async (): Promise<void> => {
  try {
    const { data } = await StockService.getWarehouseStockDropdown();
    // stockWarehouse.value = data.data;

    productModel.value.forEach((product, index) => {
      if (product) {
        const stockItem = data.data.find((item) => item.id === product.id);
        quantitySelected.value[index] = stockItem?.quantity ?? 0;
      } else {
        quantitySelected.value[index] = 0;
      }
    });
  } catch (error) {
    console.error('Error fetching warehouse stock:', error);
  }
};

const getStoreStock = async (id: number): Promise<void> => {
  try {
    // if (!id) return;
    const { data } = await StockService.getStoreStockById(id);
    // stockStore.value = data.data;
    if (isWarehouseModel.value === 'store') {
      productModel.value.forEach((product, index) => {
        if (product) {
          const stockItem = data.data.find(
            (item) => item.product.id === product.id,
          );
          quantitySelected.value[index] = stockItem?.quantity ?? 0;
        } else {
          quantitySelected.value[index] = 0;
        }
      });
    }
  } catch (error) {
    console.error('Error fetching store stock:', error);
  }
};

const updateStockMutation = async (): Promise<void> => {
  try {
    if (!transactionCode.value || !transactionDate.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Transaction code and date are required',
        life: 3000,
      });
      return;
    }

    if (!isWarehouseModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Pilih sumber barang (Gudang/Toko)',
        life: 3000,
      });
      return;
    }

    if (isWarehouseModel.value === 'store' && !fromStoreModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Pilih gudang sumber barang',
        life: 3000,
      });
      return;
    }

    if (!toStoreModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Pilih toko tujuan barang',
        life: 3000,
      });
      return;
    }
    const checkProduct = productModel.value.filter(
      (product) => product !== undefined && product.id !== undefined,
    );
    if (checkProduct.length !== totalProductFields.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Pastikan semua produk telah dipilih',
        life: 3000,
      });
      return;
    }
    const checkQuantity = quantityModel.value.filter(
      (quantity) => quantity !== undefined && quantity > 0,
    );

    if (checkQuantity.length !== totalProductFields.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Pastikan semua kuantitas telah diisi',
      });
      return;
    }

    // check quantityProduct not bigger than quantitySelected
    for (let i = 0; i < productModel.value.length; i++) {
      const product = productModel.value[i];
      const quantity = quantityModel.value[i];
      const selectedQuantity = quantitySelected.value[i];

      if (quantity > selectedQuantity) {
        toast.add({
          severity: 'warn',
          summary: 'Warning',
          detail: `Jumlah produk ${product.name} tidak boleh lebih dari stok yang tersedia (${selectedQuantity})`,
          life: 3000,
        });
        return;
      }
    }

    // check if fromStoreModel is equel to toStoreModel
    if (
      isWarehouseModel.value === 'store' &&
      fromStoreModel.value?.id === toStoreModel.value?.id
    ) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Sumber barang dan tujuan barang tidak boleh sama',
        life: 3000,
      });
      return;
    }

    const stockMutationData = {
      transactionCode: transactionCode.value as string,
      date: transactionDate.value?.toISOString(),
      fromWarehouse: isWarehouseModel.value === 'warehouse',
      fromStoreId:
        isWarehouseModel.value === 'store'
          ? (fromStoreModel.value?.id as number)
          : null,
      toStoreId: toStoreModel.value?.id,
      products: productModel.value.map((product, index) => ({
        id: product?.id as number,
        quantity: quantityModel.value[index],
      })),
    };

    // Call the service to create stock in
    await StockService.updateStockMutation(
      productMutationData?.value?.id as number,
      stockMutationData,
    );
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Barang Mutasi berhasil diubah',
      life: 3000,
    });
    backRoute();
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal memperbarui barang mutasi',
      life: 3000,
    });
  }
};

// watch(
//   () => productModel.value,
//   () => {
//     if (isWarehouseModel.value === 'warehouse') {
//       productModel.value.forEach((product, index) => {
//         if (product) {
//           const stockItem = stockWarehouse.value.find(
//             (item) => item.id === product.id,
//           );
//           quantitySelected.value[index] = stockItem?.quantity ?? 0;
//         } else {
//           quantitySelected.value[index] = 0;
//         }
//       });
//     } else if (isWarehouseModel.value === 'store') {
//       productModel.value.forEach((product, index) => {
//         if (product) {
//           const stockItem = stockStore.value.find(
//             (item) => item.product.id === product.id,
//           );
//           console.log('stockItem', stockStore.value);
//           console.log('product', product);
//           quantitySelected.value[index] = stockItem?.quantity ?? 0;
//         } else {
//           quantitySelected.value[index] = 0;
//         }
//       });
//     }
//   },
//   {
//     immediate: true,
//     deep: true,
//   },
// );

watch(
  () => transactionDate.value,
  () => {
    getProductInIndex();
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <Card>
    <form class="flex flex-col p-4 gap-3" @submit.prevent="updateStockMutation">
      <div class="flex items-center gap-10">
        <div class="w-full">
          <InputText
            v-model:model-value="transactionCode"
            label="Kode Transaksi"
            placeholder="Kode transaksi"
            disabled
          />
        </div>
        <div class="w-full">
          <DatePicker
            v-model:model-value="transactionDate"
            label="Tanggal Transaksi"
            showIcon
            fluid
            iconDisplay="input"
          />
        </div>
      </div>
      <div class="flex items-center gap-10 w-full">
        <div class="w-full">
          <span class="text-xs">Dari Gudang/Toko</span>
          <div class="flex gap-4 py-1 !text-xs">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="isWarehouseModel"
                inputId="warehouse"
                name="toWarehouse"
                value="warehouse"
                size="small"
                disabled
              />
              <label for="warehouse">Gudang</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="isWarehouseModel"
                inputId="store"
                name="toWarehouse"
                value="store"
                size="small"
                disabled
              />
              <label for="store">Toko</label>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isWarehouseModel === 'store'"
        class="grid grid-cols-2 w-full pr-10"
      >
        <Dropdown
          v-model:model-value="fromStoreModel"
          placeholder="Pilih Toko"
          label="Sumber Barang"
          disabled-button
        />
      </div>
      <div class="grid grid-cols-2 pr-10 w-full">
        <Dropdown
          v-model:model-value="toStoreModel"
          placeholder="Pilih Toko"
          label="Tujuan Barang"
          disabled-button
        />
      </div>
      <div
        v-if="totalProductFields > 0"
        v-for="i in totalProductFields"
        :key="i"
        class="flex items-center gap-4 pt-2 w-full"
      >
        <div class="flex items-center gap-10 pt-2 h-[60px] w-full">
          <div class="w-full">
            <Dropdown
              v-model:model-value="productModel[i - 1]"
              placeholder="Pilih Produk"
              label="Produk"
              disabled-button
            />
          </div>
          <div class="w-[30%] flex flex-col gap-2">
            <span class="text-xs text-center"> Stok Tersedia: </span>
            <span class="text-xs text-center">
              {{ quantitySelected[i - 1] ? quantitySelected[i - 1] : '-' }}
            </span>
          </div>
          <div class="w-full">
            <InputNumber
              v-model:model-value="quantityModel[i - 1]"
              placeholder="Jumlah"
              label="Jumlah Produk"
              :max="1000"
            />
          </div>
        </div>
      </div>
      <div></div>
      <div class="flex justify-end pt-8">
        <div class="flex flex-col gap-4 items-end">
          <div class="flex gap-2">
            <button
              type="button"
              @click="backRoute"
              class="text-xs rounded-sm !px-2 !py-1 bg-black text-white hover:bg-black/60 hover:cursor-pointer shadow-md border-1 border-gray-600"
            >
              Kembali
            </button>
            <button
              type="button"
              @click="clearFields"
              class="text-xs rounded-sm !px-2 !py-1 bg-transparent text-red-500 hover:bg-red-500/60 hover:text-white hover:cursor-pointer shadow-md border-1 border-red-500"
            >
              Bersihkan Input
            </button>
            <button
              type="submit"
              class="text-xs rounded-sm !px-2 !py-1 bg-green-400 text-white hover:bg-green-400/60 hover:text-white hover:cursor-pointer shadow-md border-1 border-green-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  </Card>
</template>
