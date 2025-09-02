<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import type {
  ButtonMultiActionEmits,
  ButtonMultiActionProps,
} from './ButtonMultiAction.vue.d';
import Icon from '../icons/Icon.vue';
import Menu from '../menu/Menu.vue';
import type { Data } from '../datatable/DataTable.vue.d';
import type { Events } from '../event-bus';
import eventBus from '../event-bus';

const props = withDefaults(defineProps<ButtonMultiActionProps>(), {
  options: () => [],
  selectedData: () => [],
});

const emit = defineEmits<ButtonMultiActionEmits>();

onMounted(() => {
  eventBus.on('data-table:update-selected-data', handleUpdateSelectedData);
  eventBus.on('data-table:update-total-record', updateTotalRecordsHandler);
});

onUnmounted(() => {
  eventBus.off('data-table:update-total-record', updateTotalRecordsHandler);
  eventBus.off('data-table:update-selected-data', handleUpdateSelectedData);
});

const menu = ref();
const dataSelected = defineModel<Data[] | undefined>('selectedData', {
  default: () => [],
});

const totalRecords = shallowRef<number>(0);
const isAllDataSelected = shallowRef<boolean>(false);

const showSelectAllButton = computed(
  () => dataSelected.value?.length && totalRecords.value > 0,
);

const toggleMenu = (event: Event): void => {
  menu.value.toggle(event);
};

const selectAllData = (): void => {
  /**
   * Trigger fetch all data from data table.
   *
   */
  if (isAllDataSelected.value) return;
  window.dispatchEvent(
    new CustomEvent('fetchAllData', { detail: props.tableName }),
  );

  eventBus.emit('data-table:select-all-record', { tableName: props.tableName });
};

const unSelectAllData = (): void => {
  emit('update:selectedData', []);
  eventBus.emit('data-table:clear-selected-data', {
    tableName: props.tableName,
  });
};

const handleUpdateSelectedData = (
  e: Events['data-table:update-selected-data'],
): void => {
  if (e.tableName === props.tableName) {
    dataSelected.value = e.data;
    emit('update:selectedData', e.data ?? []);
  }
};

const updateTotalRecordsHandler = (
  event: Events['data-table:update-total-record'],
): void => {
  if (props.tableName === event?.tableName) {
    totalRecords.value = event?.total;
  }
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

watch(
  [dataSelected, totalRecords],
  ([data, total]) => {
    isAllDataSelected.value = data?.length === total;
  },
  { deep: true },
);

watch(
  () => props.totalRecords,
  (total) => (totalRecords.value = total ?? 0),
  { immediate: true },
);
</script>
<template>
  <div
    v-if="dataSelected && dataSelected?.length > 0"
    component-wv="ButtonMultiAction"
    class="flex gap-3 items-center h-full w-full"
  >
    <button
      @click="toggleMenu($event)"
      class="text-xs rounded-sm !px-2 bg-blue-400 text-white hover:bg-blue-500/60 hover:cursor-pointer shadow-md border-1 border-primary"
    >
      Multi Action

      <Icon icon="arrow-down-s" />
    </button>
    <Menu
      id="multi-options-menu"
      ref="menu"
      :pt="{
        root: {
          class: [
            '!transition-transform !z-[7299] !w-max !min-w-40 !min-w-[110px] !max-h-[90vh] !overflow-y-auto !rounded-md !border-[1px] !border-solid !border-black !max-w-[400px] !translate-y-1 !shadow !overflow-hidden !bg-white !text-general-800',
          ],
          list: {
            class: '!px-4',
          },
        },
      }"
      :model="props.options"
      @focus="adjustMenuPosition"
      append-to="body"
      auto-z-index
      popup
    />
    <span class="text-xs"
      >{{ `${dataSelected?.length?.toString()} data dipilih` }}
    </span>
    <button
      v-show="showSelectAllButton"
      @click="selectAllData"
      :class="`text-xs ${isAllDataSelected ? 'hover:cursor-default' : 'hover:cursor-pointer'} text-primary`"
    >
      <template v-if="!isAllDataSelected">
        {{ `Pilih Semua (${totalRecords} data)` }}
      </template>
      <template v-else> Semua data terpilih </template>
    </button>

    <div @click="unSelectAllData">
      <Icon icon="close" class="text-xl !h-full text-red-500" />
    </div>
  </div>
</template>
