<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import type { DropdownOption } from '@/components/dropdown/Dropdown.vue.d';
import Dropdown from '@/components/dropdown/Dropdown.vue';
import InputText from '@/components/inputtext/InputText.vue';
import ProductService from '@/service/product.service';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BrandService from '@/service/brand.service';
import CategoryService from '@/service/category.service';
import type { DropdownValue } from '@/types/data.type';
import UnitService from '@/service/unit.service';
import { generateProductCode } from '@/utils/data.utils';
import Checkbox from '@/components/checkbox/Checkbox.vue';
import type { ApiError } from '@/types/api.type';

onMounted(() => {
  getProductIndex();
  getUnitOptions();
});

const router = useRouter();
const toast = useToast();

const productIndex = ref<number>(0);
const productCode = ref<string>();
const productNameModel = ref<string>();
const descriptionModel = ref<string>();
const brandModel = ref<DropdownOption>();
const categoryModel = ref<DropdownOption>();
const unitModel = ref<DropdownOption>();
const stayModel = ref<boolean>(false);

const brandOptions = ref<DropdownValue[]>();
const categoryOptions = ref<DropdownValue[]>();
const unitOptions = ref<DropdownValue[]>();

const backRoute = (e?: Event): void => {
  e?.preventDefault();
  router.push('/product/data');
};

const setProductId = (): void => {
  productCode.value = generateProductCode(
    productIndex.value,
    brandModel.value?.id as number,
    categoryModel.value?.id as number,
    unitModel.value?.id as number,
  );
};

const clearFields = (): void => {
  productNameModel.value = undefined;
  brandModel.value = undefined;
  descriptionModel.value = undefined;
  categoryModel.value = undefined;
  unitModel.value = undefined;
  setProductId();
};

const getProductIndex = async (): Promise<void> => {
  try {
    const { data } = await ProductService.getProductIndex();
    productIndex.value = data.data.nextIndex;
    setProductId();
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Gagal memuat indeks produk: ${(error as ApiError).response?.data?.message || 'Terjadi kesalahan'}`,
      life: 3000,
    });
  }
};

const getBrandOptions = async (): Promise<void> => {
  try {
    const { data } = await BrandService.getBrandDropdown();
    brandOptions.value = data.data;
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Gagal memuat data merek: ${(error as ApiError).response?.data?.message || 'Terjadi kesalahan'}`,
      life: 3000,
    });
  }
};

const getCategoryOptions = async (): Promise<void> => {
  try {
    const { data } = await CategoryService.getCategoryDropdown();
    categoryOptions.value = data.data as DropdownValue[];
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Gagal memuat data kategori: ${(error as ApiError).response?.data?.message || 'Terjadi kesalahan'}`,
      life: 3000,
    });
  }
};

const getUnitOptions = async (): Promise<void> => {
  try {
    const { data } = await UnitService.getUnitDropdown();
    unitOptions.value = data.data as DropdownValue[];
  } catch (error: ApiError | unknown) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Gagal memuat data satuan: ${(error as ApiError).response?.data?.message || 'Terjadi kesalahan'}`,
      life: 3000,
    });
  }
};

const createProduct = async (): Promise<void> => {
  try {
    if (!productNameModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama produk harus diisi',
        life: 3000,
      });
      return;
    }

    if (!brandModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Merek harus dipilih',
        life: 3000,
      });
      return;
    }

    if (!categoryModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Kategori harus dipilih',
        life: 3000,
      });
      return;
    }

    if (!unitModel.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Satuan harus dipilih',
        life: 3000,
      });
      return;
    }

    if (!productCode.value) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Kode produk harus diisi',
        life: 3000,
      });
      return;
    }

    if (productNameModel.value.length > 100) {
      toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Nama produk tidak boleh lebih dari 100 karakter',
        life: 3000,
      });
      return;
    }

    const productData = {
      name: productNameModel.value,
      description: descriptionModel.value,
      brandId: brandModel.value?.id,
      categoryId: categoryModel.value?.id,
      unitId: unitModel.value?.id,
      code: productCode.value,
    };

    await ProductService.createProduct(productData);

    toast.add({
      severity: 'success',
      summary: 'Sukses',
      detail: 'Produk berhasil dibuat',
      life: 3000,
    });

    if (stayModel.value) {
      clearFields();
      getProductIndex();
    } else {
      backRoute();
    }
  } catch (error: ApiError | unknown) {
    console.error('Error creating product:', error);
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: error
        ? (error as ApiError).response?.data?.message
        : 'Terjadi kesalahan saat membuat produk',
      life: 3000,
    });
  }
};
</script>
<template>
  <Card>
    <form class="flex flex-col p-4 gap-3" @submit.prevent="createProduct">
      <div class="flex items-center gap-10">
        <div class="w-full">
          <InputText
            v-model:model-value="productCode"
            label="Kode Produk"
            placeholder="Kode produk"
            disabled
          />
        </div>
        <div class="w-full">
          <InputText
            v-model:model-value="productNameModel"
            label="Nama Produk"
            placeholder="Masukkan Nama Produk"
            @blur=""
          />
        </div>
      </div>
      <div class="flex items-center gap-10">
        <div class="w-full">
          <InputText
            v-model:model-value="descriptionModel"
            label="Deskripsi Produk"
            placeholder="Masukkan Deskripsi Produk"
            :mandatory="false"
            :optional="true"
            @blur=""
          />
        </div>
        <div class="w-full">
          <Dropdown
            v-model:model-value="brandModel"
            placeholder="Pilih Merek"
            label="Merek"
            :options="brandOptions"
            @open="getBrandOptions"
            @hide="setProductId"
          />
        </div>
      </div>
      <div class="flex items-center gap-10">
        <div class="w-full">
          <Dropdown
            v-model:model-value="categoryModel"
            placeholder="Pilih Kategori"
            label="Kategori"
            :options="categoryOptions"
            @open="getCategoryOptions"
            @hide="setProductId"
          />
        </div>
        <div class="w-full">
          <Dropdown
            v-model:model-value="unitModel"
            placeholder="Pilih Satuan"
            label="Satuan"
            :options="unitOptions"
            @open="getUnitOptions"
            @hide="setProductId"
          />
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
