<script setup lang="ts">
import PrimeMultiSelect from 'primevue/multiselect';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import type {
  FieldValues,
  MultiSelectEmits,
  MultiSelectOption,
  MultiSelectProps,
} from './MultiSelect.vue.d';
import { computed, reactive, ref, shallowRef, watch } from 'vue';
import type MultiSelect from 'primevue/multiselect';
import type { DropdownOption, OptionValue } from '../dropdown/Dropdown.vue.d';

const props = withDefaults(defineProps<MultiSelectProps>(), {
  placeholder: 'Pilih opsi',
  label: 'Label',
  display: 'chip',
  filter: true,
  maxSelectedLabels: 3,
  mandatory: true,
  optional: false,
});

const emit = defineEmits<MultiSelectEmits>();

const multiselect = ref<InstanceType<typeof MultiSelect>>();
const isShowOverlay = shallowRef<boolean>(false);

const field = reactive<FieldValues<OptionValue[]>>({
  value: props?.modelValue ?? [],
});

const visibleOptions = computed(() => filterOptions(props?.options));

const filterOptions = (
  options?: DropdownOption[] | MultiSelectOption[] | string[],
): DropdownOption[] | string[] => {
  if (!options?.length) return [];

  if (typeof options?.[0] === 'string') {
    return options as string[];
  }
  return (options as DropdownOption[])?.filter(
    (option) => option.visible !== false,
  );
};

const showOverlay = (): void => {
  if (multiselect.value) multiselect.value.show();
};

const hideOverlay = (): void => {
  if (multiselect.value) multiselect.value.hide();
};

const onUpdateValue = (value?: OptionValue[]): void => {
  /**
   * Prevent model value has empty array, it will lead unexpected result of API request.
   */
  const modelValue = value?.length ? value : undefined;
  emit('update:modelValue', modelValue);
};

watch(
  () => field.value,
  () => {
    onUpdateValue(field.value);
  },
);

watch(
  () => props.modelValue,
  (value) => {
    field.value = value ?? [];
  },
);

defineExpose({
  isShowOverlay,
  showOverlay,
  hideOverlay,
});
</script>

<template>
  <FieldWrapper :label="label" :mandatory="mandatory" :optional="optional">
    <InputGroup
      :disabled="true"
      :use-input-group="true"
      class="!w-full !h-[30px]"
    >
      <PrimeMultiSelect
        v-bind="props"
        ref="multiselect"
        v-model="field.value"
        :display="display"
        :placeholder="placeholder"
        :max-selected-labels="maxSelectedLabels"
        :options="visibleOptions"
        :show-toggle-all="props?.filter"
        :virtual-scroller-options="
          (options?.length ?? 0) > 10 ? { itemSize: 32 } : undefined
        "
        @hide="((isShowOverlay = false), $emit('hide'))"
        @show="($emit('show'), (isShowOverlay = true))"
        :pt="{
          root: {
            class: ['!w-full !h-full !text-xs'],
          },
          option: {
            class: ['!text-xs'],
          },
          pcOptionCheckbox: {
            root: {
              class: ['!w-[16px] !h-[16px]'],
            },
            input: {
              class: ['!w-[16px] !h-[16px]'],
            },
            box: {
              class: ['!w-[16px] !h-[16px]'],
            },
          },
          emptyMessage: {
            class: ['!text-xs !text-gray-500'],
          },
          dropdownIcon: {
            class: ['!w-[12px]'],
          },
          label: {
            class: '!text-xs !text-gray-500 !h-full',
          },
          pcChip: {
            root: {
              class: ['!text-xs !h-[24px] !rounded-sm'],
            },
          },
          pcFilterContainer: {
            root: {
              class: ['!w-full !h-[30px]'],
            },
          },
          pcFilter: {
            root: {
              class: ['!w-full !h-[30px]'],
            },
          },
          pcHeaderCheckbox: {
            root: {
              class: ['!w-[16px] !h-[16px]'],
            },
            input: {
              class: ['!w-[16px] !h-[16px]'],
            },
            box: {
              class: ['!w-[16px] !h-[16px]'],
            },
          },
        }"
      />
    </InputGroup>
  </FieldWrapper>
</template>
