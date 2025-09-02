<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import DatePicker from '@/components/datepicker/DatePicker.vue';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import type { DropdownOption } from '@/components/dropdown/Dropdown.vue.d';
import Icon from '@/components/icons/Icon.vue';
import InputNumber from '@/components/inputnumber/InputNumber.vue';
import InputText from '@/components/inputtext/InputText.vue';
import StockService from '@/service/stock.service';
import StoreService from '@/service/store.service';
import type { ApiError } from '@/types/api.type';
import type { StockWarehouse } from '@/types/stock.type';
import { generateTransactionCodeOut } from '@/utils/data.utils';
import { useToast } from 'primevue';
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const transactionCode = ref<string>();
const transactionDate = ref<Date>();
const storeModel = ref<DropdownOption>();
const productModel = ref<DropdownOption[]>([]);
const productOptions = ref<DropdownOption[]>([]);
const storeOptions = ref<DropdownOption[]>();
const quantityModel = ref<number[]>([]);
const stayModel = ref<boolean>(false);
const totalProductFields = shallowRef<number>(0);
const transactionCodeIndex = ref<number>(0);
const stockStore = ref<StockWarehouse[]>([]);
const quantitySelected = ref<number[]>([]);

onMounted(() => {
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
  storeModel.value = undefined;
  productModel.value = [];
  quantityModel.value = [];
  stayModel.value = false;
  totalProductFields.value = 0;
  transactionDate.value = undefined;
  quantitySelected.value = [];
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

const setTransactionCode = (): void => {
  transactionCode.value = generateTransactionCodeOut(
    transactionCodeIndex.value,
  );
};

const setQuantity = (index: number): void => {
  if (productModel.value[index]) {
    const stockItem = stockStore.value.find(
      (item) => item.product.id === productModel.value[index].id,
    );
    quantitySelected.value[index] = stockItem?.quantity ?? 0;
  } else {
    quantitySelected.value[index] = 0;
  }
};

const getProductInIndex = async (): Promise<void> => {
  try {
    const { data } = await StockService.getStockOutIndex();
    transactionCodeIndex.value = data.data.nextCode;
    setTransactionCode();
  } catch (error) {
    console.error('Error fetching stock in index:', error);
  }
};

const getStoreStock = async (): Promise<void> => {
  try {
    if (!storeModel.value) return;
    const { data } = await StockService.getStoreStockById(storeModel.value.id);
    stockStore.value = data.data;
    productOptions.value = data.data.map((item) => ({
      id: item.product.id,
      name: item.product.name,
    }));
  } catch (error) {
    console.error('Error fetching store stock:', error);
  }
};

const createStockOut = async (): Promise<void> => {
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

    if (totalProductFields.value === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Tidak ada produk yang dipilih',
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
        productId: product.id,
        quantity: quantityModel.value[index],
      })),
    };

    // Call the service to create stock in
    await StockService.postStockOut(stockOutData);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Barang keluar berhasil dibuat',
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
        : 'Gagal membuat barang keluar',
      life: 3000,
    });
  }
};

watch(
  () => storeModel.value,
  () => {
    if (storeModel.value) {
      getStoreStock();
      getProductInIndex();
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => productModel.value,
  () => {
    getProductInIndex();
  },
  {
    immediate: true,
  },
);

watch(
  () => transactionDate.value,
  () => {
    getProductInIndex();
  },
  {
    immediate: true,
  },
);

watch(
  () => storeModel.value,
  () => {
    if (storeModel.value) {
      productModel.value = [];
      quantityModel.value = [];
      quantitySelected.value = [];
      totalProductFields.value = 0;
    }
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <Card>
    <form class="flex flex-col p-4 gap-3" @submit.prevent="createStockOut">
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
        <div class="grid grid-cols-2 w-full pr-10">
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
              @hide="setQuantity(i - 1)"
              @open="getStoreStock"
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
      <div></div>
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
