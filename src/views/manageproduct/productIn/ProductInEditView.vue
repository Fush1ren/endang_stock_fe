<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import DatePicker from '@/components/datepicker/DatePicker.vue';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import type { DropdownOption } from '@/components/dropdown/Dropdown.vue.d';
import InputNumber from '@/components/inputnumber/InputNumber.vue';
import InputText from '@/components/inputtext/InputText.vue';
import StockService from '@/service/stock.service';
import type { StockIn } from '@/types/stock.type';
import { RadioButton, useToast } from 'primevue';
import { onMounted, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const transactionCode = ref<string>();
const transactionDate = ref<Date>();
const isWarehouseModel = ref<string>();
const storeModel = ref<DropdownOption>();
const productModel = ref<DropdownOption[]>([]);
const quantityModel = ref<number[]>([]);
const totalProductFields = shallowRef<number>(0);
const dataProductIn = ref<StockIn>();

onMounted(() => {
  getProductIn();
});

const clearFields = (): void => {
  quantityModel.value = [];
  transactionDate.value = undefined;
};

const backRoute = (): void => {
  // Logic to navigate back goes here
  router.back();
};

const getProductIn = async (): Promise<void> => {
  try {
    const productInId = sessionStorage.getItem('productIn');
    if (!productInId) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada data produk masuk yang ditemukan',
        life: 3000,
      });
      return;
    }

    const { data } = await StockService.getStockInById(Number(productInId));
    dataProductIn.value = data.data;
    transactionCode.value = data.data.transactionCode;
    transactionDate.value = new Date(data.data.date);
    isWarehouseModel.value = data.data.toWarehouse ? 'warehouse' : 'store';
    storeModel.value = data.data.toWarehouse
      ? undefined
      : {
          id: data.data.toStore?.id as number,
          name: data.data.toStore?.name as string,
        };
    data.data.products.forEach((product) => {
      productModel.value.push({ id: product.id, name: product.name });
      quantityModel.value.push(product.quantity);
    });
    totalProductFields.value = data.data.products.length;
  } catch (error) {
    console.error('Error fetching product in:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gagal mengambil data produk masuk',
      life: 3000,
    });
  }
};

const updateStockIn = async (): Promise<void> => {
  try {
    if (!transactionCode.value || !transactionDate.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Kode transaksi dan tanggal diperlukan',
        life: 3000,
      });
      return;
    }

    if (isWarehouseModel.value !== 'warehouse' && !storeModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Jika tidak masuk ke gudang, pilih toko terlebih dahulu',
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
        life: 3000,
      });
      return;
    }

    const stockInData = {
      transactionCode: transactionCode.value as string,
      date: transactionDate.value?.toISOString(),
      toWarehouse: isWarehouseModel.value === 'warehouse' ? true : false,
      storeId: (storeModel.value?.id as number) ?? null,
      products: productModel.value.map((product, index) => ({
        id: product.id,
        quantity: quantityModel.value[index],
      })),
    };

    // Call the service to update stock in
    await StockService.updateStockIn(
      dataProductIn.value?.id as number,
      stockInData,
    );
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Barang masuk berhasil diubah',
      life: 3000,
    });
    backRoute();
  } catch (error) {
    console.error('Error updating stock in:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Gagal memperbarui barang masuk',
      life: 3000,
    });
  }
};
</script>
<template>
  <Card>
    <form class="flex flex-col p-4 gap-3" @submit.prevent="updateStockIn">
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
      <div class="flex items-center gap-10">
        <div class="w-full">
          <span class="text-xs">Masuk ke Gudang / Toko</span>
          <div class="flex gap-4 py-1 !text-xs cursor-not-allowed">
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
        <div v-if="isWarehouseModel === 'store'" class="w-full">
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
          <div class="w-full">
            <InputNumber
              v-model:model-value="quantityModel[i - 1]"
              placeholder="Jumlah"
              label="Quantity"
              :max="1000"
            />
          </div>
        </div>
      </div>
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
