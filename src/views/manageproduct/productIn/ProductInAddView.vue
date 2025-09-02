<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import DatePicker from '@/components/datepicker/DatePicker.vue';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import type { DropdownOption } from '@/components/dropdown/Dropdown.vue.d';
import Icon from '@/components/icons/Icon.vue';
import InputNumber from '@/components/inputnumber/InputNumber.vue';
import InputText from '@/components/inputtext/InputText.vue';
import ProductService from '@/service/product.service';
import StockService from '@/service/stock.service';
import StoreService from '@/service/store.service';
import type { ApiError } from '@/types/api.type';
import { generateTransactionCodeIn } from '@/utils/data.utils';
import { RadioButton, useToast } from 'primevue';
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const transactionCode = ref<string>();
const transactionDate = ref<Date>();
const isWarehouseModel = ref<string>();
const storeModel = ref<DropdownOption>();
const quantityModel = ref<number[]>([]);
const productModel = ref<DropdownOption[]>([]);
const productOptions = ref<DropdownOption[]>();
const storeOptions = ref<DropdownOption[]>();
const stayModel = ref<boolean>(false);
const totalProductFields = shallowRef<number>(0);
const transactionCodeIndex = ref<number>(0);

onMounted(() => {
  getStoreOptions();
  getProductOptions();
  transactionDate.value = new Date();
  getProductInIndex();
});

const addProduct = (): void => {
  // Logic to add product goes here
  totalProductFields.value += 1;
  setTransactionCode();
};

const removeField = (index: number): void => {
  if (totalProductFields.value > 0) {
    totalProductFields.value -= 1;
    productModel.value.splice(index, 1);
    quantityModel.value.splice(index, 1);
    setTransactionCode();
  }
};

const clearFields = (): void => {
  transactionCode.value = undefined;
  isWarehouseModel.value = undefined;
  storeModel.value = undefined;
  productModel.value = [];
  quantityModel.value = [];
  stayModel.value = false;
  totalProductFields.value = 0;
  transactionDate.value = undefined;
  setTransactionCode();
};

const backRoute = (): void => {
  // Logic to navigate back goes here
  router.back();
};

const getStoreOptions = async (): Promise<void> => {
  try {
    const { data } = await StoreService.getStoreDropdown();
    storeOptions.value = data.data;
  } catch (error) {
    console.error('Error fetching store options:', error);
  }
};

const getProductOptions = async (): Promise<void> => {
  try {
    const { data } = await ProductService.getProductDropdown();
    productOptions.value = data.data;
  } catch (error) {
    console.error('Error fetching product options:', error);
  }
};

const setTransactionCode = (): void => {
  transactionCode.value = generateTransactionCodeIn(transactionCodeIndex.value);
};

const getProductInIndex = async (): Promise<void> => {
  try {
    const { data } = await StockService.getStockInIndex();
    transactionCodeIndex.value = data.data.nextCode;
    setTransactionCode();
  } catch (error) {
    console.error('Error fetching stock in index:', error);
  }
};

const createStockIn = async (): Promise<void> => {
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

    if (isWarehouseModel.value !== 'warehouse' && !storeModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Jika tidak masuk ke gudang, pilih toko terlebih dahulu',
        life: 3000,
      });
      return;
    }
    if (totalProductFields.value <= 0) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Pastikan ada produk yang ditambahkan',
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
        productId: product.id,
        quantity: quantityModel.value[index],
      })),
    };

    // Call the service to create stock in
    await StockService.postStockIn(stockInData);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Barang masuk berhasil dibuat',
      life: 3000,
    });
    if (!stayModel.value) {
      backRoute();
      getProductInIndex();
    } else {
      clearFields();
    }
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Gagal membuat barang masuk',
      life: 3000,
    });
  }
};

watch(
  () => isWarehouseModel.value,
  () => {
    storeModel.value = undefined;
    getProductInIndex();
  },
  { immediate: true },
);

watch(
  () => transactionDate.value,
  () => {
    getProductInIndex();
  },
  { immediate: true },
);

watch(
  () => totalProductFields.value,
  () => {
    getProductInIndex();
  },
  { immediate: true },
);

watch(
  () => productModel.value,
  () => {
    getProductInIndex();
  },
  { immediate: true },
);

watch(
  () => storeModel.value,
  () => {
    getProductInIndex();
  },
  { immediate: true },
);

watch(
  () => quantityModel.value,
  () => {
    getProductInIndex();
  },
  { immediate: true },
);
</script>
<template>
  <Card>
    <form class="flex flex-col p-4 gap-3" @submit.prevent="createStockIn">
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
          <div class="flex gap-4 py-1 !text-xs">
            <div class="flex items-center gap-2">
              <RadioButton
                v-model="isWarehouseModel"
                inputId="warehouse"
                name="toWarehouse"
                value="warehouse"
                size="small"
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
            :options="storeOptions"
            @open="getStoreOptions"
          />
        </div>
      </div>
      <div class="flex items-center gap-10 pt-2">
        <div class="w-full">
          <button
            type="button"
            @click="addProduct"
            class="text-xs rounded-sm px-2 py-1 bg-blue-400 text-white hover:bg-blue-500/60 hover:cursor-pointer shadow-md border-1 border-primary"
          >
            Tambah Produk

            <Icon icon="add" />
          </button>
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
              :options="productOptions"
              @open="getProductOptions"
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
          <div class="h-full flex items-end">
            <div class="w-[30px]">
              <button
                type="button"
                @click="removeField(i - 1)"
                class="text-xs rounded-full px-2 py-1 bg-red-400 text-white hover:bg-red-500/60 hover:cursor-pointer shadow-md"
              >
                <Icon icon="delete-bin" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end pt-8">
        <div class="flex flex-col gap-4 items-end">
          <Checkbox v-model:model-value="stayModel" label="Tetap di sini?" />
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
