<script setup lang="ts">
import { nextTick, ref, shallowRef } from 'vue';
import Icon from '../icons/Icon.vue';
import eventBus from '../event-bus';
import InputText from '../inputtext/InputText.vue';
import type { ButtonSearchProps } from './ButtonSearch.vue.d';

withDefaults(defineProps<ButtonSearchProps>(), {
  tableName: 'datatable',
});

const showSearchInput = shallowRef<boolean>(false);
const query = shallowRef<string>();
const inputtext = ref();

const showInput = (): void => {
  showSearchInput.value = true;

  focusToInput();
};

const focusToInput = (): void => {
  nextTick(() => {
    if (inputtext.value) {
      inputtext.value['$el'].focus();
    }
  });
};

const updateInput = (event: Event | string): void => {
  console.log('updateInput', event);
  query.value = (event as string) || undefined;
};
</script>
<template>
  <button v-if="!showSearchInput" @click="showInput" type="button">
    <Icon icon="search" class="text-xl" />
  </button>
  <form
    v-else
    class="flex pr-8 gap-2"
    @submit.prevent="
      () => {
        console.log('searching', query);
        eventBus.emit('search-table', { tableName, search: query });
        $emit('search', query);
      }
    "
  >
    <button
      @click="
        () => {
          query = undefined;
          showSearchInput = false;
          $emit('collapsed');
          eventBus.emit('search-table', { tableName, search: undefined });
          $emit('search', undefined);
        }
      "
      type="button"
    >
      <Icon icon="close" class="text-xl" />
    </button>

    <InputText
      ref="inputtext"
      :model-value="query"
      placeholder="Cari"
      class="border-none"
      @input="updateInput"
    />
  </form>
</template>
