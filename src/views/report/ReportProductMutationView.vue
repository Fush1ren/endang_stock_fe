<script setup lang="ts">
import Card from '@/components/card/Card.vue';
import DataTable from '@/components/datatable/DataTable.vue';
import type {
  QueryParams,
  TableColumn,
} from '@/components/datatable/DataTable.vue.d';
import StockService from '@/service/stock.service';
import type { FetchListResponse } from '@/types/api.type';
import type { StockMutationReport } from '@/types/stock.type';
import { formatDate } from '@/utils/data.utils';
import { ref, watch } from 'vue';
import DatePicker from '@/components/datepicker/DatePicker.vue';
import Icon from '@/components/icons/Icon.vue';
import Button from '@/components/button/Button.vue';
import eventBus from '@/components/event-bus';
import type { MultiRowAttribute } from '@/components/multirow/MultiRow.vue.d';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RadioButton } from 'primevue';

const filteredByModel = ref<string>('date');
const transactionFilter = ref<Date[] | any>();
const stockMutationReport = ref<StockMutationReport[]>([]);

const head = ref<string[][]>([
  [
    'No',
    'Tanggal Transaksi',
    'Kode Barang',
    'Barang',
    'Jumlah Barang',
    'Sumber Barang',
    'Tujuan Barang',
  ],
]);
const body = ref<any>([]);

const tableColumns: TableColumn[] = [
  {
    field: 'date',
    header: 'Tanggal Transaksi',
    sortable: false,
    bodyTemplate: (rowData: StockMutationReport) => {
      return rowData.date ? formatDate(new Date(rowData.date)) : '-';
    },
  },
  {
    field: 'product.code',
    header: 'Kode Barang',
    sortable: false,
    preset: {
      type: 'multirow',
      fieldAttributes: (data: StockMutationReport): MultiRowAttribute[] => {
        return data?.products?.map((item) => {
          return {
            value: `${item.code}`,
          };
        });
      },
    },
  },
  {
    field: 'product.name',
    header: 'Barang',
    sortable: false,
    preset: {
      type: 'multirow',
      fieldAttributes: (data: StockMutationReport): MultiRowAttribute[] => {
        return data?.products?.map((item) => {
          return {
            value: `${item.name}`,
          };
        });
      },
    },
  },
  {
    field: 'product.quantity',
    header: 'Jumlah Barang',
    sortable: false,
    preset: {
      type: 'multirow',
      fieldAttributes: (data: StockMutationReport): MultiRowAttribute[] => {
        return data?.products?.map((item) => {
          return {
            value: `${item.quantity}`,
          };
        });
      },
    },
  },
  {
    field: 'fromStore',
    header: 'Sumber Barang',
    sortable: false,
    bodyTemplate: (rowData: StockMutationReport) => {
      return rowData.fromStore ? rowData?.fromStore : '-';
    },
  },
  {
    field: 'toStore',
    header: 'Tujuan Barang',
    sortable: false,
    bodyTemplate: (rowData: StockMutationReport) => {
      return rowData.toStore ? rowData?.toStore : '-';
    },
  },
];

const triggerFilter = (): void => {
  const parsedFilter: QueryParams = {};

  if (filteredByModel.value === 'month') {
    let start = new Date(transactionFilter.value[0]);
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    let end = new Date(transactionFilter.value[1]);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);
  }

  let start = transactionFilter.value[0];

  let end = transactionFilter.value[1]
    ? new Date(transactionFilter.value[1])
    : new Date(transactionFilter.value[0]);

  if (filteredByModel.value === 'month') {
    start?.setDate(1);
    end?.setMonth(end.getMonth() + 1);
    end?.setDate(0);
    end?.setHours(23, 59, 59, 999);
  }

  const dateRange = [start];
  if (end) {
    dateRange.push(end);
  }

  parsedFilter.date = JSON.stringify(dateRange);

  eventBus.emit('data-table:apply-filter', {
    tableName: 'table-report-product-mutation',
    filter: parsedFilter,
  });
  // if (!transactionFilter.value) return;
  // const month = transactionFilter?.value?.getMonth() + 1;
  // const year = transactionFilter?.value?.getFullYear();
  // const params = {
  //   month: month,
  //   year: year,
  // } as any;

  // if (filteredByModel.value === 'date') {
  //   params.date = transactionFilter?.value?.getDate();
  // }

  // eventBus.emit('data-table:apply-filter', {
  //   tableName: 'table-report-product-mutation',
  //   filter: params,
  // });
};

const togglePrint = (): void => {
  const doc = new jsPDF();
  let monthYear = '';

  if (transactionFilter.value && transactionFilter.value.length > 0) {
    const start = transactionFilter.value[0];
    const end =
      transactionFilter.value[1] || new Date(transactionFilter.value[0]);
    if (filteredByModel.value === 'month') {
      console.log(transactionFilter.value);
      monthYear =
        transactionFilter?.value?.length > 1 &&
        !transactionFilter?.value?.includes(null)
          ? `${start.toLocaleDateString('id-ID', {
              month: 'long',
              year: 'numeric',
            })} - ${end.toLocaleDateString('id-ID', {
              month: 'long',
              year: 'numeric',
            })}`
          : start.toLocaleDateString('id-ID', {
              month: 'long',
              year: 'numeric',
            });
    } else {
      monthYear =
        transactionFilter?.value?.length > 1 &&
        !transactionFilter?.value?.includes(null)
          ? `${start.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })} - ${end.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}`
          : start.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            });
    }
  }
  // const monthYear = transactionFilter.value
  //   ? transactionFilter.value.toLocaleDateString(
  //       'id-ID',
  //       filteredByModel.value === 'date'
  //         ? {
  //             day: '2-digit',
  //             month: 'long',
  //             year: 'numeric',
  //           }
  //         : {
  //             month: 'long',
  //             year: 'numeric',
  //           },
  //     )
  //   : '';

  doc.text('Laporan Barang Mutasi', 105, 10, {
    align: 'center',
  });
  doc.text('Agen Sembako Mbak Endang', 105, 20, {
    align: 'center',
  });
  doc.text(monthYear, 105, 30, {
    align: 'center',
  });

  let groupedMap = [];
  for (const trx of stockMutationReport.value) {
    const date = new Date(trx.date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    for (const product of trx.products) {
      groupedMap.push({
        date: date,
        code: product.code,
        productName: product.name,
        totalQty: product.quantity,
        fromStore: trx.fromStore,
        toStore: trx.toStore,
      });
    }
  }

  groupedMap.map((item, index) => {
    body.value.push([
      index + 1,
      item.date,
      item.code,
      item.productName,
      item.totalQty.toString(),
      item.fromStore,
      item.toStore,
    ]);
  });

  // Buat tabel di PDF
  autoTable(doc, {
    head: head.value,
    body: body.value,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 123, 255] },
    margin: { top: 40 },
  });

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url);
  body.value = [];
};

const tableData = async (
  params: QueryParams,
): Promise<FetchListResponse<StockMutationReport> | undefined> => {
  try {
    const { data } = await StockService.getStockMutationReport(params);
    stockMutationReport.value = data?.data?.data || [];
    return data;
  } catch (error) {
    console.error('Error fetching store stock:', error);
  }
};

watch(
  () => transactionFilter.value,
  () => {
    body.value = [];
    head.value = [
      [
        'No',
        'Tanggal Transaksi',
        'Kode Barang',
        'Barang',
        'Jumlah Barang',
        'Sumber Barang',
        'Tujuan Barang',
      ],
    ];
  },
);

watch(
  () => filteredByModel.value,
  () => {
    if (filteredByModel.value) {
      transactionFilter.value = undefined;
    }
  },
  { immediate: true },
);
</script>

<template>
  <Card>
    <div class="flex flex-col gap-3 text-black">
      <div class="flex flex-row gap-1 w-fit">
        <span class="text-lg font-semibold">Laporan Barang Mutasi</span>
      </div>
      <div class="flex flex-col gap-2 pt-2">
        <div class="flex flex-row justify-start gap-2 w-full items-center">
          <div class="pr-4">
            <span class="text-xs">Filter Berdasarkan</span>
            <div class="flex gap-4 py-1 !text-xs">
              <div class="flex items-center gap-2">
                <RadioButton
                  v-model="filteredByModel"
                  inputId="date"
                  name="date"
                  value="date"
                  size="small"
                />
                <label for="warehouse">Tanggal</label>
              </div>
              <div class="flex items-center gap-2">
                <RadioButton
                  v-model="filteredByModel"
                  inputId="month"
                  name="month"
                  value="month"
                  size="small"
                />
                <label for="store">Bulan</label>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 w-full">
            <div>
              <DatePicker
                v-model="transactionFilter"
                :view="filteredByModel === 'date' ? 'date' : 'month'"
                :dateFormat="filteredByModel === 'date' ? 'dd MM yy' : 'MM yy'"
                :placeholder="
                  filteredByModel === 'date'
                    ? 'Pilih Tanggal Transaksi'
                    : 'Pilih Bulan & Tahun Transaksi'
                "
                selection-mode="range"
              />
            </div>
            <div>
              <Button
                @click="triggerFilter"
                label="Terapkan"
                severity="primary"
                class="text-xs"
              />
            </div>
          </div>

          <div class="w-full flex justify-end gap-2">
            <button
              @click="togglePrint"
              class="text-xs rounded-sm !px-2 !py-1 bg-blue-500 text-white hover:bg-blue-500/60 hover:text-white hover:cursor-pointer shadow-md border-1 border-blue-600"
            >
              <div class="flex items-center gap-1">
                <Icon icon="printer" />
                <span>Cetak Laporan</span>
              </div>
            </button>
          </div>
        </div>
        <DataTable
          data-key="id"
          :fetch-function="tableData"
          :columns="tableColumns"
          :use-options="false"
          table-name="table-report-product-mutation"
          selection-type="single"
          use-paginator
        />
      </div>
    </div>
  </Card>
</template>
