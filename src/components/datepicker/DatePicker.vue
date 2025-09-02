<script setup lang="ts">
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import PrimeDatePicker from 'primevue/datepicker';
import type { DatePickerProps, DatePicketValue } from './DatePicker.vue.d';
import type { ValueNull } from '@/types/data.type';
import InputGroup from '../inputgroup/InputGroup.vue';

withDefaults(defineProps<DatePickerProps>(), {
  name: null,
  selectionMode: 'single',
  showIcon: true,
  fluid: true,
  iconDisplay: 'input',
  mandatory: false,
  optional: false,
  placeholder: 'Pilih tanggal',
  dateFormat: 'dd M yy',
  view: 'date',
});

const modelValue = defineModel<ValueNull<DatePicketValue>>('modelValue', {
  default: undefined,
});
</script>

<template>
  <FieldWrapper
    :label="label"
    :label-class="labelClass"
    :mandatory="mandatory"
    :optional="optional"
  >
    <InputGroup :disabled="true" :use-input-group="true">
      <PrimeDatePicker
        v-model="modelValue"
        :name="name as string"
        :selection-mode="selectionMode"
        :show-icon="showIcon"
        :fluid="fluid"
        :view="view"
        :dateFormat="dateFormat"
        :icon-display="iconDisplay"
        :pt="{
          root: {
            class: ['!text-sm'],
          },
          panel: {
            class: ['!bg-white'],
          },
          pcInputText: {
            root: {
              class: ['!text-xs'],
            },
          },
          header: {
            class: ['!text-sm'],
          },
          dayView: {
            class: ['!text-sm'],
          },
        }"
        :placeholder="placeholder"
      />
    </InputGroup>
  </FieldWrapper>
</template>
