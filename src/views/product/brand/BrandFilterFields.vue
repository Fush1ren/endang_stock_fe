<script setup lang="ts">
import Button from '@/components/button/Button.vue';
import type { QueryParams } from '@/components/datatable/DataTable.vue.d';
import DatePicker from '@/components/datepicker/DatePicker.vue';
import eventBus, { type Events } from '@/components/event-bus';
import type { OptionsValue } from '@/types/data.type';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

type FilterContainerProps = {
  tableName?: string;
};

const fieldsPerRow = ref<number>(4);
const brandModel = ref<OptionsValue[]>();
const categoryModel = ref<OptionsValue[]>();
const unitModel = ref<OptionsValue[]>();
const updatedAtModel = ref<Date[]>([]);
const createdAtModel = ref<Date[]>([]);
const showFilter = shallowRef(false);
const container = ref<HTMLDivElement | null>(null);

const props = withDefaults(defineProps<FilterContainerProps>(), {
  tableName: 'product-table',
});

const emit = defineEmits<{
  apply: [filter: QueryParams];
}>();

onMounted(() => {
  setGridFieldsLayout();

  eventBus.on('show-filter', updateShowFilter);
});

onBeforeUnmount(() => {
  eventBus.off('show-filter', updateShowFilter);
});

const apply = () => {
  const parsedFilter: QueryParams = {};

  eventBus.emit('multi-select:hide-overlay');
  if (brandModel.value && brandModel.value.length > 0) {
    parsedFilter.brand = JSON.stringify(brandModel.value);
  }
  if (categoryModel.value && categoryModel.value.length > 0) {
    parsedFilter.category = JSON.stringify(categoryModel.value);
  }
  if (unitModel.value && unitModel.value.length > 0) {
    parsedFilter.unit = JSON.stringify(unitModel.value);
  }
  if (updatedAtModel.value && updatedAtModel.value.length > 0) {
    const start = updatedAtModel.value[0]
      ? new Date(updatedAtModel.value[0])
      : null;
    const end = updatedAtModel.value[1]
      ? new Date(updatedAtModel.value[1])
      : new Date(updatedAtModel.value[0]);
    const dateRange = [start];
    if (end) {
      dateRange.push(end);
    }
    parsedFilter.updatedAt = JSON.stringify(dateRange);
  }

  if (createdAtModel.value && createdAtModel.value.length > 0) {
    const start = createdAtModel.value[0]
      ? new Date(createdAtModel.value[0])
      : null;
    const end = createdAtModel.value[1]
      ? new Date(createdAtModel.value[1])
      : new Date(createdAtModel.value[0]);
    const dateRange = [start];
    if (end) {
      dateRange.push(end);
    }
    parsedFilter.createdAt = JSON.stringify(dateRange);
  }

  eventBus.emit('data-table:apply-filter', {
    tableName: props?.tableName,
    filter: parsedFilter,
  });

  eventBus.emit('data-table:clear-selected-data', {
    tableName: props?.tableName,
  });

  emit?.('apply', parsedFilter);
};

const clear = (): void => {
  updatedAtModel.value = [];
  createdAtModel.value = [];
};

const updateShowFilter = (e: Events['show-filter']): void => {
  if (e.tableName === props.tableName) {
    showFilter.value = e.show;
  }
};

const setGridFieldsLayout = (): void => {
  if (container.value) {
    const { children } = container.value;
    const childCount = container.value.childElementCount;
    const isOdd = childCount % fieldsPerRow.value;

    let [rowPos, colPos] = [1, 1];
    for (const i in Array.from({ length: childCount })) {
      const isLast = Number(i) === childCount - 1;
      children[i].setAttribute(
        'style',
        `grid-area: ${rowPos}/${isLast && isOdd ? fieldsPerRow.value : colPos}`,
      );

      if (++colPos > fieldsPerRow.value) {
        colPos = 1;
        rowPos++;
      }
    }
  }
};

defineOptions({
  inheritAttrs: false,
});
</script>
<template>
  <div
    ref="container"
    v-show="showFilter"
    class="grid gap-4 py-2 bg-[#5080e1]/10 rounded-md px-3"
    :style="`grid-template-columns: repeat(${fieldsPerRow}, 1fr)`"
  >
    <div>
      <DatePicker
        v-model:model-value="updatedAtModel"
        label="Terakhir Diubah"
        placeholder="Pilih Tanggal"
        showIcon
        fluid
        selection-mode="range"
        iconDisplay="input"
      />
    </div>
    <div>
      <DatePicker
        v-model:model-value="createdAtModel"
        label="Dibuat Pada"
        placeholder="Pilih Tanggal"
        showIcon
        fluid
        selection-mode="range"
        iconDisplay="input"
      />
    </div>
    <div
      class="flex items-end justify-end gap-2"
      data-wv-section="filteractionbuttons"
      style="grid-area: 2/4"
    >
      <Button
        @click="clear"
        label="Bersihkan Filter"
        data-wv-section="clearbutton"
        severity="secondary"
        class="text-xs"
      />
      <Button
        @click="apply"
        label="Terapkan Filter"
        data-wv-section="applybutton"
        severity="success"
        class="text-xs"
      />
    </div>
  </div>
</template>
