<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { cloneDeep } from 'lodash';
import type {
  Data,
  DataTableEmits,
  DataTableProps,
  FetchResponse,
  IconSort,
  QueryParams,
  TableColumn,
} from './DataTable.vue.d';
import Icon from '../icons/Icon.vue';
import type { Events, TableEvent } from '../event-bus';
import eventBus from '../event-bus';
import Animation from '../animation/Animation.vue';
import { getNestedProperyValue } from '@/utils/object.utils';
import { Paginator, type PageState } from 'primevue';
import Checkbox from '../checkbox/Checkbox.vue';
import Menu from '../menu/Menu.vue';
import MultiRow from '../multirow/MultiRow.vue';

const props = withDefaults(defineProps<DataTableProps>(), {
  tableName: 'datatable',
  options: () => [],
  dataKey: 'id',
  selectionType: 'single',
  useOptions: true,
  disableKey: 'isDefault',
});

const singleSelection = defineModel<Data>('singleSelection');

const emit = defineEmits<DataTableEmits>();

onMounted(async () => {
  if (props.fetchFunction) {
    await fetch();
    listenUpdateTableEvent();
  }

  if (props.selectedData?.length) {
    checkboxSelection.value = props.selectedData;
  }

  attachEventListener();

  if (tableWrapper.value) {
    tableWrapper.value.onscroll = adjustFrozenColumnRightDistance;

    new ResizeObserver(adjustFrozenColumnRightDistance).observe(
      tableElement.value as HTMLTableElement,
    );
  }
});

const currentPageTableData = ref<Data[]>(props.data ?? []);
const visibleColumns = ref<TableColumn[]>(props.columns);
const loadingTable = ref<boolean>(false);
const tablePage = shallowRef(1);
const tableRows = shallowRef(10);
const totalRecords = shallowRef(0);

const rowsPerPageOptions = [10, 25, 50, 100];

const tableElement = ref<HTMLTableElement>();
const tableWrapper = ref<HTMLDivElement>();
const rowSingleActionCell = ref<HTMLTableCellElement>();

const rightDistanceFrozenColumn = shallowRef<number>(0);

const columnKey = shallowRef<number>(0);
const tableKey = shallowRef<number>(0);
const paginatorKey = shallowRef<number>(0);

const sortBy = shallowRef<string>();
const sortOrder = shallowRef<-1 | 1>();

const filterQueryParams = shallowRef<QueryParams>({});
const searchQueryParam = shallowRef<string>();

const checkboxSelection = shallowRef<Data[]>([]);
const dataSelection = shallowRef<Data>();
const optionMenu = ref();

const queryParams = computed<QueryParams>(() => ({
  search: searchQueryParam.value,
  page: props.usePaginator ? tablePage.value : undefined,
  limit: props.usePaginator ? tableRows.value : undefined,
  sortOrder: sortOrder.value,
  sortBy: sortBy.value,
  ...filterQueryParams.value,
}));

const tableIsLoading = computed<boolean>(() => loadingTable.value);

const currentPageHasNoData = computed<boolean>(
  () => !tableIsLoading.value && !currentPageTableData.value?.length,
);

const columnsCount = computed(() => {
  return (
    visibleColumns.value.length +
    (props.selectionType === 'checkbox' ? 1 : 0) +
    (props.useOptions ? 1 : 0) +
    1
  );
});

const currentPageDisabledRows = computed(() =>
  getDisabledRows(props.data ?? filterParentRowData() ?? []),
);

const filterParentRowData = (rowData?: Data[]): Data[] => {
  return (rowData ?? currentPageTableData.value ?? []).filter(
    (d) => !d.childRowHeader && !d.childRow,
  );
};

const filterDisabledRows = (
  tableData: Data[] | undefined,
  rowsIDs?: string[],
): Data[] => {
  return (tableData ?? []).filter(
    (data) =>
      !(rowsIDs ?? currentPageDisabledRows.value).includes(data[props.dataKey]),
  );
};

const clearSelectedDataHandler = (
  e: Events['data-table:clear-selected-data'],
): void => {
  if (e.tableName === props.tableName) {
    checkboxSelection.value = [];
  }
};

const isArrayIncluded = (
  smallArray: string[],
  largeArray: string[],
): boolean => {
  return smallArray.every((element) => largeArray.includes(element));
};

const isSelectedAll = computed(() => {
  if (
    props.disableAllRows ||
    !filterParentRowData()?.length ||
    props.selectionType !== 'checkbox' ||
    currentPageDisabledRows.value?.length === currentPageTableData.value.length
  )
    return false;

  const length = checkboxSelection.value?.length;

  const currentPageDataKey =
    filterDisabledRows(filterParentRowData())?.map((dt) => dt[props.dataKey]) ??
    [];

  const selectedDataKey =
    checkboxSelection.value?.map((dt) => dt[props.dataKey]) ?? [];

  const isCurrentPageAllSelected = selectedDataKey.length
    ? isArrayIncluded(currentPageDataKey, selectedDataKey)
    : false;

  const isAllRecordSelected =
    length > 0 &&
    length ===
      (totalRecords.value ?? 0) - (currentPageDisabledRows.value.length ?? 0);

  return isCurrentPageAllSelected || isAllRecordSelected;
});

const dataTableID = ((): string => {
  const path = window.location.pathname.replace('/', '').split('/').join('-');
  return `${path}-${props.tableName}`;
})();

const getDisabledRows = (tableData: Data[] | undefined = []): string[] => {
  if (props.disableAllRows) return tableData.map((data) => data[props.dataKey]);
  return tableData
    .filter((data) => data[props.disableKey])
    .map((data) => data[props.dataKey]);
};

const isSingleSelected = (key: string): boolean => {
  return singleSelection.value?.[props.dataKey] === key;
};

const isRowSelected = (key: string): boolean => {
  return props.selectionType === 'checkbox'
    ? !!checkboxSelection.value.find((data) => data[props.dataKey] === key)
    : isSingleSelected(key);
};

const adjustMenuPosition = (event: Event): void => {
  let el = event.target as HTMLElement;

  if (el.tagName === 'UL') {
    el = el.parentElement as HTMLElement;
  }

  const { offsetHeight = 0 } = el;
  const maxHeight = (window.innerHeight * 90) / 100;

  if (offsetHeight >= maxHeight) {
    el.style.transform = 'translateY(5vh)';
  }
};

const isRowDisabled = (key: string): boolean => {
  const keys = currentPageDisabledRows.value;
  return keys.includes(key);
};

const iconSort = (fields: string): IconSort => {
  if (sortBy.value === fields) {
    if (sortOrder.value === 1) {
      return {
        icon: 'sort-asc',
        type: 'none',
      };
    } else if (sortOrder.value === -1) {
      return {
        icon: 'sort-desc',
        type: 'none',
      };
    }
  }
  return {
    icon: 'arrow-up-down',
  };
};

const backgroundSort = (fields: string): string => {
  if (sortBy.value === fields) {
    if (sortOrder.value === 1 || sortOrder.value === -1) {
      return 'bg-blue-600';
    }
    return '';
  }
  return '';
};

const sortColumn = (field: string, e: Event) => {
  if (field !== sortBy.value) sortOrder.value = undefined; // Resets the sort order when the column sorted changed

  sortBy.value = field;

  if (!sortOrder.value) {
    sortOrder.value = 1;
  } else if (sortOrder.value == -1) {
    sortOrder.value = undefined;
    sortBy.value = undefined;
  } else {
    sortOrder.value = -1;
  }

  emit('sort', {
    sortOrder: sortOrder.value,
    sortField: sortBy.value,
    originalEvent: e,
    rows: tableRows.value,
  });

  resetPage();
  if (props.fetchFunction) fetch();
};

const toggleMenu = (event: MouseEvent, data: Data): void => {
  dataSelection.value = data;

  emit('toggleOption', dataSelection.value);

  const toggleEvent: Event = {
    ...event,
    currentTarget: event.currentTarget ?? event.target,
  };

  optionMenu.value?.toggle(toggleEvent);
};

const handleUpdateTableEvent = (event: TableEvent): void => {
  if (!event.tableName || event.tableName === props.tableName) {
    nextTick(() => {
      columnKey.value++;
      fetch();
    }); // Waits until computed queryparams ready
  }
};

const searchTableHandler = (e: Events['search-table']): void => {
  if (e.tableName === props.tableName) {
    searchQueryParam.value = e.search;
    handleFilter();
  }
};

const adjustFrozenColumnRightDistance = (): void => {
  rightDistanceFrozenColumn.value =
    (tableWrapper.value?.scrollWidth ?? 0) -
    (tableWrapper.value?.offsetWidth ?? 0) -
    (tableWrapper.value?.scrollLeft ?? 0) -
    (rowSingleActionCell.value?.offsetWidth ?? 0);
};

const handlePageChange = async (event: PageState): Promise<void> => {
  tableRows.value = event.rows;
  tablePage.value = event.page + 1;

  await fetch();
};

const toggleRowSelection = (event: Event, data: Data, index: number): void => {
  const selected = isRowSelected(data[props.dataKey]);

  emit('rowSelect', { originalEvent: event, data, index });

  if (props.selectionType === 'checkbox') {
    if (selected)
      checkboxSelection.value = checkboxSelection.value.filter(
        (d) => d[props.dataKey] != data[props.dataKey],
      );
    else checkboxSelection.value = [...checkboxSelection.value, data];
  } else {
    singleSelection.value = selected ? undefined : data;
  }
};

const toggleAllDataSelection = (e: boolean): void => {
  if (props.includeCheckDisabledRows) {
    checkboxSelection.value = e
      ? filterParentRowData()
      : filterParentRowData().filter((d) => isRowDisabled(d[props.dataKey]));
  } else {
    checkboxSelection.value = e
      ? filterDisabledRows(filterParentRowData())
      : [];
  }
};

const updateTotalRecordMultiAction = (total?: number): void => {
  const disabledCount = props.includeCheckDisabledRows
    ? 0
    : ((currentPageDisabledRows.value.length || props.totalDisabledRows) ?? 0);

  const data = {
    total: (total ?? 0) - disabledCount,
    tableName: props.tableName,
  };
  eventBus.emit('data-table:update-total-record', data);
};

const selectAllData = async (event: TableEvent): Promise<void> => {
  if (props.tableName !== event.tableName) return;

  try {
    loadingTable.value = true;
    const { data, totalRecords: total = 0 } = (await fetchAllData()) ?? {
      totalRecords: (props.data ?? []).length,
      data: props.data,
    };

    const disabledRows = getDisabledRows(data);
    checkboxSelection.value = props.includeCheckDisabledRows
      ? (data ?? [])
      : filterDisabledRows(data, disabledRows);

    updateTotalRecordMultiAction(total);
  } finally {
    loadingTable.value = false;
  }
};

const applyFilterHandler = (e: Events['data-table:apply-filter']): void => {
  if (e.tableName === props.tableName) {
    filterQueryParams.value = e.filter;
    handleFilter();
  }
};

const attachEventListener = (): void => {
  eventBus.on('data-table:apply-filter', applyFilterHandler);
  eventBus.on('search-table', searchTableHandler);
  eventBus.on('data-table:select-all-record', selectAllRecordHandler);
  eventBus.on('data-table:clear-selected-data', clearSelectedDataHandler);
};

const removeEventListener = (): void => {
  eventBus.off('data-table:apply-filter', applyFilterHandler);
  eventBus.off('search-table', searchTableHandler);
  eventBus.off('data-table:update', handleUpdateTableEvent);
  eventBus.off('data-table:select-all-record', selectAllRecordHandler);
  eventBus.off('data-table:clear-selected-data', clearSelectedDataHandler);
};

const selectAllRecordHandler = (
  e: Events['data-table:select-all-record'],
): void => {
  if (e.tableName === props.tableName) {
    selectAllData(e);
  }
};

const resetPage = (): void => {
  tablePage.value = 1;
  paginatorKey.value++;
};

const resetPageLimit = (): void => {
  tableRows.value = 10;
  tablePage.value = 1;
  paginatorKey.value++;
};

const resetSortQuery = (): void => {
  sortBy.value = undefined;
  sortOrder.value = undefined;
};

const resetDataTableQuery = (): void => {
  resetPageLimit();
  resetSortQuery();
};

const fetchAllData = async (): Promise<FetchResponse['data']> => {
  const params = cloneDeep(queryParams.value);
  delete params.page;
  delete params.limit;

  const res = await props.fetchFunction?.(params);
  if (res instanceof Error) throw res;
  return res?.data ?? { data: [], totalRecords: 0 };
};

const handleFilter = async (): Promise<void> => {
  tableKey.value++;
  paginatorKey.value++;

  resetDataTableQuery();
  await fetch();
};

const fetch = async (): Promise<void> => {
  try {
    loadingTable.value = true;
    const response = await props.fetchFunction?.(queryParams.value);
    const { data = [], totalRecords: total = 0 } = response?.data ?? {};
    updateTotalRecordMultiAction(total);
    totalRecords.value = total;
    currentPageTableData.value = data;

    if (totalRecords.value === 0) {
      const span = document.querySelectorAll('span.p-paginator-pages');
      Array.from(span).filter((el) => {
        const buttonPage = document.createElement(
          'button',
        ) as HTMLButtonElement;
        buttonPage.className = `${el.className} empty-page p-paginator-page-selected !text-general-300 !justify-center !relative !text-xs !font-normal !rounded-full !w-6 !h-6 !text-general-300 !border-none !hover:bg-grayscale-50 !hover:border-surface-300 !focus-visible:outline-none !focus-visible:outline-offset-0 !focus-visible:ring-2 !focus-visible:ring-primary-500 !transition !duration-200 !overflow-hidden`;
        buttonPage.type = 'button';
        buttonPage.textContent = '0';
        el.appendChild(buttonPage);
      });
    } else {
      const span = document.querySelectorAll('button.empty-page');
      Array.from(span).forEach((el) => {
        el.remove();
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loadingTable.value = false;
    nextTick(adjustFrozenColumnRightDistance);
  }
};

onUnmounted(() => {
  removeEventListener();
});

const listenUpdateTableEvent = (): void => {
  eventBus.on('data-table:update', handleUpdateTableEvent);
};

watch(
  checkboxSelection,
  (newSelectedData: Data[]) => {
    emit('selectData', newSelectedData);
    emit('update:selectedData', newSelectedData);

    eventBus.emit('data-table:update-selected-data', {
      tableName: props.tableName,
      data: newSelectedData,
    });
  },
  { deep: true },
);
</script>
<template>
  <div class="relative">
    <div
      class="overflow-auto scrollbar-w-thin pb-1 rounded-lg rounded-br-none rounded-bl-none"
    >
      <div
        class="overflow-visible w-full min-w-max rounded-lg border-b border-b-primary"
        ref="tableWrapper"
      >
        <table
          :id="dataTableID"
          :key="tableKey"
          ref="tableElement"
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead class="bg-primary text-white sticky top-0 z-40">
            <tr class="text-xs font-medium">
              <th
                v-if="selectionType === 'checkbox'"
                class="px-2 !border-2 !border-black"
              >
                <Checkbox
                  v-model="isSelectedAll"
                  :pt="{
                    box: {
                      class: `${isSelectedAll ? '!bg-black !border-black' : '!bg-transparent !border-white !border-2 !rounded-sm'}`,
                    },
                    icon: {
                      class: '!text-white !w-3 !h-3',
                    },
                  }"
                  @update:model-value="toggleAllDataSelection(!!$event)"
                  binary
                />
              </th>
              <th
                v-if="visibleColumns.length > 0"
                class="!border-2 !border-black"
              >
                <div class="flex items-center gap-2 px-2 w-[20px]">
                  <span>No</span>
                </div>
              </th>
              <th
                :key="cols.field"
                v-for="(cols, index) in visibleColumns"
                scope="col"
                :class="`p-2 text-center !border-2 !border-black ${cols.sortable ? 'cursor-pointer' : ''} ${backgroundSort(cols.field)}`"
                @click="cols.sortable ? sortColumn(cols.field, $event) : null"
              >
                <div
                  :class="`flex items-center gap-2 ${index === 0 ? 'pl-[1px]' : 'px-2'}`"
                >
                  <span>{{ cols.header }}</span>

                  <Icon
                    v-if="cols.sortable"
                    :icon="iconSort(cols.field).icon"
                    :type="iconSort(cols.field).type"
                    class="!h-auto"
                  />
                </div>
              </th>
              <th
                v-if="props.useOptions"
                scope="col"
                class="p-2 text-center min-w-[30px] sticky bg-primary !border-2 !border-black"
                style="right: 0"
              />
            </tr>
          </thead>
          <tbody>
            <template v-if="tableIsLoading">
              <td
                :colspan="columnsCount"
                class="text-xs px-2 py-0.5 border-0 !border-b !border-solid border-primary-100 justify-items-start"
              >
                <div
                  class="w-full p-4 flex items-center justify-center top-[35px] inset-x-0 pointer-events-none"
                >
                  <Animation
                    animation="loading_table2"
                    class="w-[11rem] h-auto"
                  />
                </div>
              </td>
            </template>
            <template v-else-if="!currentPageHasNoData">
              <tr
                :id="item._id"
                :key="index"
                v-for="(item, index) in currentPageTableData"
                @click="toggleRowSelection($event, item, index)"
                :class="`text-black text-xs group hover:bg-[#dadde7e4] hover:rounded-xl ${index === currentPageTableData.length - 1 ? '!border-2 !border-black !rounded-full' : 'border-b border-b-primary !border-2 !border-black'}`"
              >
                <td
                  v-if="selectionType === 'checkbox'"
                  class="p-2"
                  @click.stop=""
                >
                  <Checkbox
                    v-model="checkboxSelection"
                    :value="item"
                    :pt="{
                      box: {
                        class: `${isRowSelected(item[props.dataKey]) ? '!bg-black !border-black' : '!bg-transparent !border-black !border-2 !rounded-sm'}`,
                      },
                      icon: {
                        class: '!text-white !w-3 !h-3',
                      },
                    }"
                    :binary="false"
                  />
                </td>

                <td class="px-2 text-start !border-2 !border-black">
                  <span>{{
                    tableRows * tablePage + (index + 1) - tableRows
                  }}</span>
                </td>

                <td
                  :key="col.field"
                  v-for="col in visibleColumns"
                  class="p-2 !border-2 !border-black"
                  @click.stop=""
                >
                  <template v-if="col.preset?.type === 'multirow'">
                    <MultiRow
                      :attributes="col.preset?.fieldAttributes?.(item) ?? []"
                    />
                  </template>

                  <template
                    v-else-if="
                      col.bodyComponent || col.bodyClass || col.bodyTemplate
                    "
                  >
                    <component
                      :is="col.bodyComponent!(item, index).component"
                      v-if="col.bodyComponent"
                      v-model="col.bodyComponent!(item, index).model"
                      v-bind="col.bodyComponent!(item, index).props"
                      v-on="
                        col.bodyComponent!(item, index).events
                          ? col.bodyComponent!(item, index).events
                          : {}
                      "
                      @change="col.bodyComponent!(item, index).onChange?.(item)"
                      @click.stop=""
                      @update:model-value="
                        col.bodyComponent!(item, index).onChange?.(item)
                      "
                    />

                    <span v-else-if="col.bodyTemplate" class="p-2">
                      {{ col.bodyTemplate?.(item, index) || '-' }}
                    </span>
                    <span v-else class="p-2">
                      {{ getNestedProperyValue(item, col.field) || '-' }}
                    </span>
                  </template>

                  <template v-else>
                    {{ getNestedProperyValue(item, col.field) || '-' }}
                  </template>
                </td>

                <td
                  ref="rowSingleActionCell"
                  v-if="props.useOptions"
                  class="sticky bg-white group-hover:!bg-[#dadde7e4] !border-2 !border-black"
                  style="right: 0"
                  @click.stop=""
                >
                  <Icon
                    @click="toggleMenu($event, item)"
                    icon="more"
                    class="rounded-full border p-px"
                  />
                </td>
              </tr>
            </template>
            <template v-else>
              <td
                :colspan="columnsCount"
                class="text-xs px-2 py-0.5 border-0 !border-b !border-solid border-primary-100 justify-items-start"
              >
                <div
                  class="w-full p-4 flex items-center justify-center top-[35px] inset-x-0 pointer-events-none"
                >
                  <Animation
                    animation="no_data_table2"
                    class="w-[11rem] h-auto"
                  />
                </div>
              </td>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Paginator
    :key="paginatorKey"
    v-show="!tableIsLoading"
    v-model:rows="tableRows"
    :pt="{
      root: {
        class: [
          '!flex !items-center !justify-start !flex-wrap !gap-0.5 !px-0',
          '!text-grayscale-900 !bg-transparent',
        ],
      },
      content: {
        class: ['!h-[28px]'],
      },
      page: {
        class:
          '!relative !text-xs !font-normal !rounded-full !w-6 !h-6 !text-general-300 !border-none !hover:bg-grayscale-50 !hover:border-surface-300 !focus-visible:outline-none !focus-visible:outline-offset-0 !focus-visible:ring-2 !focus-visible:ring-primary-500 !transition !duration-200 !overflow-hidden',
      },
      firstIcon: {
        class:
          '!h-[28px] relative text-2xl font-medium inline-flex items-center justify-center border-t-2 border-transparent w-6 h-6 text-general-300 transition duration-200 user-none overflow-hidden cursor-default pointer-events-none opacity-60',
      },

      prevIcon: {
        class:
          '!h-[28px] relative text-2xl font-medium inline-flex items-center justify-center border-t-2 border-transparent w-6 h-6 text-general-300 transition duration-200 user-none overflow-hidden cursor-default pointer-events-none opacity-60',
      },

      nextIcon: {
        class:
          '!h-[28px] relative text-2xl font-medium inline-flex items-center justify-center border-t-2 border-transparent w-6 h-6 text-general-300 transition duration-200 user-none overflow-hidden cursor-default pointer-events-none opacity-60',
      },

      lastIcon: {
        class:
          '!h-[28px] relative text-2xl font-medium inline-flex items-center justify-center border-t-2 border-transparent w-6 h-6 text-general-300 transition duration-200 user-none overflow-hidden cursor-default pointer-events-none opacity-60',
      },

      pcRowPerPageDropdown: {
        class: [
          '!inline-flex !items-center !justify-center !relative !w-max !px-3 !py-1 !rounded-[50px] !bg-transparent !border-[0.5px] !border-primary-100 !transition-all !duration-200 !focus-visible:outline-none !focus-visible:ring-2 !focus-visible:ring-primary-600 !cursor-pointer !select-none',
          '!text-xs !flex !items-center !bg-transparent !text-general-800 !w-max !rounded-none !transition !duration-200 !focus-visible:outline-none !focus-visible:shadow-none !cursor-pointer !overflow-hidden !overflow-ellipsis !whitespace-nowrap !appearance-none',
        ],
      },
      pcjumptopageinputtext: {
        root: {
          class: ['!text-xs !h-[24px] !text-center'],
        },
        pcinputtext: {
          root: {
            class: ['!text-xs !text-center !rounded-full'],
            style: {
              textAlign: 'center',
            },
          },
        },
      },
      current: {
        class: [
          '!relative !text-xs !font-normal !rounded-full !text-black !bg-grayscale-900 !focus-visible:outline-none !focus-visible:outline-offset-0 !focus-visible:ring-2 !focus-visible:ring-primary-500 !transition !duration-200 !px-2',
        ],
      },
    }"
    :rows-per-page-options="rowsPerPageOptions"
    :total-records="totalRecords"
    template="FirstPageLink PrevPageLink PageLinks JumpToPageInput NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :current-page-report-template="
      totalRecords
        ? 'Menampilkan {first} - {last} dari {totalRecords}'
        : 'Tidak ditemukan data'
    "
    @page="handlePageChange"
  >
    <template #firsticon>
      <Icon icon="arrow-left-double" />
    </template>

    <template #lasticon>
      <Icon icon="arrow-right-double" />
    </template>

    <template #previcon>
      <Icon icon="arrow-left-s" />
    </template>

    <template #nexticon>
      <Icon icon="arrow-right-s" />
    </template>
  </Paginator>

  <Menu
    id="options-menu"
    ref="optionMenu"
    :pt="{
      root: {
        class: [
          '!transition-transform !z-[7299] !w-max !min-w-40 !min-w-[196px] !max-h-[90vh] !overflow-y-auto !rounded-md !border-[1px] !border-solid !border-black !max-w-[400px] !translate-y-1 !shadow !overflow-hidden !bg-white !text-general-800',
        ],
        list: {
          class: '!px-4',
        },
      },
    }"
    :model="options"
    @focus="adjustMenuPosition"
    append-to="body"
    auto-z-index
    popup
  />
</template>
