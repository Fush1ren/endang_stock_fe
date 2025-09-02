<script setup lang="ts">
import { shallowRef } from 'vue';
import Icon from '../icons/Icon.vue';
import eventBus from '../event-bus';

const showFilter = shallowRef<boolean>(false);

type FilterButtonProps = {
  tableName?: string;
};

const props = withDefaults(defineProps<FilterButtonProps>(), {
  tableName: 'datatable',
});

const emit = defineEmits<{
  showFilter: [payload: boolean];
}>();

const toggleFilterPanel = (): void => {
  showFilter.value = !showFilter.value;
  emit('showFilter', showFilter.value);
  eventBus.emit('show-filter', {
    tableName: props?.tableName,
    show: showFilter.value,
  });
};
</script>
<template>
  <button @click="toggleFilterPanel" type="button" class="hover:cursor-pointer">
    <Icon
      icon="filter"
      :type="`${showFilter ? 'fill' : 'line'}`"
      class="text-xl"
    />
  </button>
</template>
