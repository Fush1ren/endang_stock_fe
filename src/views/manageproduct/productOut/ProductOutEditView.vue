<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import DatePicker from '@/components/datepicker/DatePicker.vue';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import type { DropdownOption } from '@/components/dropdown/Dropdown.vue.d';
import InputNumber from '@/components/inputnumber/InputNumber.vue';
import InputText from '@/components/inputtext/InputText.vue';
import StockService from '@/service/stock.service';
import type { ApiError } from '@/types/api.type';
import type { StockOut, StockWarehouse } from '@/types/stock.type';
import { useToast } from 'primevue';
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const transactionCode = ref<string>();
const transactionDate = ref<Date>();
const storeModel = ref<DropdownOption>();
const productModel = ref<DropdownOption[]>([]);
const quantityModel = ref<number[]>([]);
const totalProductFields = shallowRef<number>(0);
const stockStore = ref<StockWarehouse[]>([]);
const quantitySelected = ref<number[]>([]);
const productOutData = ref<StockOut>();

onMounted(() => {
  getProductOut();
  getStoreStock();
});

const clearFields = (): void => {
  quantityModel.value = [];
  transactionDate.value = undefined;
};

const backRoute = (): void => {
  // Logic to navigate back goes here
  router.back();
};

const getProductOut = async (): Promise<void> => {
  try {
    const productOutId = JSON.parse(
      sessionStorage.getItem('productOut') || '{}',
    )?.id;
    if (!productOutId) {
      console.error('Product Out ID not found in session storage');
      return;
    }
    const { data } = await StockService.getStockOutById(Number(productOutId));
    productOutData.value = data.data;
    transactionCode.value = data.data.transactionCode;
    transactionDate.value = new Date(data.data.date);
    storeModel.value = {
      id: data.data.fromStore?.id,
      name: data.data?.fromStore.name,
    };
    data.data.products.forEach((product) => {
      productModel.value.push({
        id: product.id,
        name: product.name,
      });
      quantityModel.value.push(product.quantity);
    });
    totalProductFields.value = data.data.products.length;
  } catch (error) {
    console.error('Error fetching product out:', error);
  }
};

const getStoreStock = async (): Promise<void> => {
  try {
    const storeId = JSON.parse(
      sessionStorage.getItem('productOut') || '{}',
    )?.fromStoreId;
    if (!storeId) {
      console.error('Store ID not found in session storage');
      return;
    }
    const { data } = await StockService.getStoreStockById(storeId);
    stockStore.value = data.data;
  } catch (error) {
    console.error('Error fetching store stock:', error);
  }
};

const updateStockOut = async (): Promise<void> => {
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

    if (!storeModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Toko harus dipilih',
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

    if (totalProductFields.value === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada produk yang dipilih',
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
        life: 3000,
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

    const stockOutData = {
      transactionCode: transactionCode.value as string,
      date: transactionDate.value?.toISOString(),
      storeId: (storeModel.value?.id as number) ?? null,
      products: productModel.value.map((product, index) => ({
        id: product.id,
        quantity: quantityModel.value[index],
      })),
    };

    await StockService.updateStockOut(
      productOutData?.value?.id as number,
      stockOutData,
    );
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Barang keluar berhasil diubah',
      life: 3000,
    });
    backRoute();
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal memperbarui Barang keluar',
      life: 3000,
    });
  }
};

watch(
  () => productModel.value,
  () => {
    // Update quantitySelected whenever productModel changes
    quantitySelected.value = productModel.value.map((product) => {
      const stockItem = stockStore.value.find(
        (item) => item.product.id === product.id,
      );
      return stockItem ? stockItem.quantity : 0;
    });
  },
  { immediate: true, deep: true },
);
</script>
<template>
  <Card>
    <form class="flex flex-col p-4 gap-3" @submit.prevent="updateStockOut">
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
      <div class="w-full">
        <div class="grid grid-cols-2 pr-10 w-full">
          <Dropdown
            v-model:model-value="storeModel"
            placeholder="Pilih Toko"
            label="Toko"
            disabled-button
          />
        </div>
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
