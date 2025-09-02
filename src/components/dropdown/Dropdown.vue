<script setup lang="ts">
import { AutoComplete } from 'primevue';
import { onMounted, ref } from 'vue';
import type {
  DropdownEmits,
  DropdownOption,
  DropdownProps,
} from './Dropdown.vue.d';

const props = withDefaults(defineProps<DropdownProps>(), {
  options: undefined,
  disabled: true,
  disabledButton: false,
});

defineEmits<DropdownEmits>();

const modelValue = defineModel<DropdownOption>('modelValue', {
  default: undefined,
});

const inputElements = ref<HTMLInputElement[]>([]);

onMounted(() => {
  if (props.disabled) {
    const inputElement = document.getElementsByClassName(
      'p-autocomplete-input',
    ) as HTMLCollectionOf<HTMLInputElement>;
    inputElements.value = Array.from(inputElement);
    inputElements.value.forEach((input) => {
      input.disabled = true;
    });
  }

  if (props.disabledButton) {
    const buttonElements = document.getElementsByClassName(
      'p-autocomplete-dropdown',
    ) as HTMLCollectionOf<HTMLButtonElement>;
    Array.from(buttonElements).forEach((button) => {
      button.disabled = true;
    });
  }
});
</script>

<template>
  <div :class="`dropdown-${label}`">
    <span class="text-xs">{{ props.label }}</span>
    <AutoComplete
      v-model="modelValue"
      dropdown
      :pt="{
        root: {
          class: '!w-full !h-[30px] !rounded-sm',
        },
        selectedMessage: {
          class: '!text-xs text-gray-500',
        },
        pcInputText: {
          class: ['!rounded-full'],
        },
        dropdown: {
          class: `${props.disabledButton ? '!cursor-not-allowed' : ''}`,
        },
      }"
      optionLabel="name"
      :placeholder="
        props.placeholder ? props.placeholder : `Pilih ${props.label}`
      "
      :showEmptyMessage="true"
      :loading="props.loading ? props.loading : false"
      :suggestions="props.options"
      @hide="$emit('hide')"
      @complete="$emit('open')"
    >
      <template #empty>
        <div class="p-2 text-center">Tidak ada data</div>
      </template>
    </AutoComplete>
  </div>
</template>
