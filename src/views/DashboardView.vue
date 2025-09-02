<script setup lang="ts">
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue';
import type { BreadcrumbMenu } from '@/components/breadcrumb/Breadcrumb.vue.d';
import Card from '@/components/card/Card.vue';
import DashboardTotalData from '@/components/dashboard/DashboardTotalData.vue';
import type { TableColumn } from '@/components/datatable/DataTable.vue.d';
import DataTable from '@/components/datatable/DataTable.vue';
import DashboardService from '@/service/dashboard.service';
import type { FetchListResponse } from '@/types/api.type';
import type { DashboardLowStockData } from '@/types/dashboard.type';
import Chart from 'primevue/chart';
import { onMounted, ref, watch } from 'vue';
import DatePicker from '@/components/datepicker/DatePicker.vue';
import TabMenu from '@/components/tabmenu/TabMenu.vue';
import Icon from '@/components/icons/Icon.vue';
import { getStockAppPermission } from '@/utils/auth.utils';

const chartOptions = ref();
const chartData = ref();
const years = ref<Date>(new Date());
const activeIndex = ref<number>(0);
const isOpen = ref<boolean>(false);

onMounted(() => {
  getChartOptions();
});

const breadcrumbMenus: BreadcrumbMenu[] = [
  {
    name: 'Dashboard',
    route: '/dashboard',
  },
];

const tableColumns: TableColumn[] = [
  {
    header: 'Kode Produk',
    field: 'product.code',
    sortable: false,
    bodyTemplate: (rowData: DashboardLowStockData) => {
      return rowData.codeProduct || '-';
    },
  },
  {
    header: 'Nama Produk',
    field: 'product.name',
    sortable: false,
    bodyTemplate: (rowData: DashboardLowStockData) => {
      return rowData.productName || '-';
    },
  },
  {
    header: 'Merek',
    field: 'product.brand.name',
    sortable: false,
    bodyTemplate: (rowData: DashboardLowStockData) => {
      return rowData.brand || '-';
    },
  },
  {
    header: 'Jumlah Stok',
    field: 'quantity',
    sortable: false,
    bodyTemplate: (rowData: DashboardLowStockData) => {
      return rowData.quantity !== undefined
        ? rowData.quantity.toLocaleString()
        : '-';
    },
  },
  {
    header: 'Lokasi Stok',
    field: 'location.name',
    sortable: false,
    bodyTemplate: (rowData: DashboardLowStockData) => {
      return rowData.location || '-';
    },
  },
];

const chartDataProductIn = async (): Promise<void> => {
  try {
    const params = {
      year: years.value?.getFullYear(),
    };
    const { data } =
      await DashboardService.getDashboardChartDataProductIn(params);
    chartData.value = data.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

const chartDataProductOut = async (): Promise<void> => {
  try {
    const params = {
      year: years.value?.getFullYear(),
    };
    const { data } =
      await DashboardService.getDashboardChartDataProductOut(params);
    chartData.value = data.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

const chartDataProductMutation = async (): Promise<void> => {
  try {
    const params = {
      year: years.value?.getFullYear(),
    };
    const { data } =
      await DashboardService.getDashboardChartDataProductMutation(params);
    chartData.value = data.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

const getChartOptions = (): void => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue(
    '--p-text-muted-color',
  );
  const surfaceBorder = documentStyle.getPropertyValue(
    '--p-content-border-color',
  );
  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

const openDropdown = (): void => {
  isOpen.value = !isOpen.value;
};

const tableData = async (): Promise<
  FetchListResponse<DashboardLowStockData[]> | undefined
> => {
  try {
    const { data } = await DashboardService.getDashboardLowStockData();
    return data;
  } catch (error) {
    console.error('Error fetching table data:', error);
  }
};

watch(
  () => isOpen.value,
  () => {
    if (isOpen.value) {
      if (activeIndex.value === 0) {
        chartDataProductIn();
      } else if (activeIndex.value === 1) {
        chartDataProductOut();
      } else if (activeIndex.value === 2) {
        chartDataProductMutation();
      }
    } else {
      chartData.value = undefined;
      chartOptions.value = undefined;
      years.value = new Date();
    }
  },
  { immediate: true },
);

watch(
  [years, activeIndex],
  () => {
    if (isOpen.value) {
      if (activeIndex.value === 0) {
        chartDataProductIn();
      } else if (activeIndex.value === 1) {
        chartDataProductOut();
      } else if (activeIndex.value === 2) {
        chartDataProductMutation();
      }
    }
  },
  { immediate: true },
);
</script>
<template>
  <div id="main-view" class="bg-[#eeedf2] w-full overflow-y-hidden">
    <div class="flex flex-col gap-3 p-4">
      <Breadcrumb :menus="breadcrumbMenus" />
      <DashboardTotalData v-if="getStockAppPermission('setting_user').view" />
      <Card
        class="w-full"
        v-if="
          getStockAppPermission('product_in').view &&
          getStockAppPermission('product_out').view &&
          getStockAppPermission('product_mutation').view
        "
      >
        <div
          @click="openDropdown"
          class="w-full bg-blue-500/80 text-white p-2 rounded-xl hover:cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm">Trend Transaksi Produk </span>
            <Icon
              :icon="isOpen ? 'arrow-up-s' : 'arrow-down-s'"
              class="text-xl !h-full"
            />
          </div>
        </div>
        <div class="pt-2" v-if="isOpen">
          <TabMenu
            v-model:active-index="activeIndex"
            :tab-labels="['Produk Masuk', 'Produk Keluar', 'Produk Mutasi']"
          />
          <div class="overflow-x-auto p-2">
            <div class="grid grid-cols-4">
              <div>
                <span class="text-xs font-medium">Berdasarkan Tahun</span>
                <DatePicker
                  v-model:model-value="years"
                  view="year"
                  dateFormat="yy"
                />
              </div>
            </div>
            <div class="py-4 overflow-auto">
              <Chart
                v-if="isOpen && years"
                type="bar"
                :data="chartData"
                :options="chartOptions"
                :pt="{
                  // root: {
                  //   class: 'sm:!w-full w-[500px]',
                  // },
                  root: {
                    style: 'width: 1200px;',
                  },
                  canvas: {
                    class: '!w-full',
                  },
                }"
              />
            </div>
          </div>
        </div>
      </Card>
      <Card
        :pt="{
          body: {
            class: '!p-4 md:!p-5',
          },
        }"
      >
        <div class="flex flex-col gap-2">
          <div>
            <span class="text-sm font-medium"
              >Stock Barang yang telah mencapai batas minimum</span
            >
          </div>
          <DataTable
            data-key="id"
            :columns="tableColumns"
            :fetch-function="tableData"
            :use-options="false"
            table-name="table-dashboard-low-stock"
            selection-type="none"
          />
        </div>
      </Card>
    </div>
  </div>
</template>
