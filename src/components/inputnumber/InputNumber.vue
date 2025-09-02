<script setup lang="ts">
import { InputGroupAddon, InputNumber } from 'primevue';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import InputGroup from '../inputgroup/InputGroup.vue';
import { computed, shallowRef } from 'vue';
import type { ValueNull } from '@/types/data.type';
import type { InputNumberProps } from './InputNumber.vue.d';

const props = withDefaults(defineProps<InputNumberProps>(), {
  useInputGroup: true,
  fluid: true,
  useGrouping: false,
  min: 0,
  max: 100,
  size: 'small',
  mode: 'decimal',
  disabled: false,
  placeholder: 'Masukkan angka',
  label: 'Label',
});

const modelValue = defineModel<ValueNull<number>>('modelValue', {
  default: undefined,
});

const inputKey = shallowRef(0);

const inputNumberClasses = computed(() => [
  '!text-sm !text-black',
  'placeholder:!font-light',
  '!appearance-none',
  props.inputClass,
]);
</script>
<template>
  <FieldWrapper
    :label="label"
    :label-class="labelClass"
    :mandatory="mandatory"
    :optional="optional"
  >
    <InputGroup
      :class="
        inputContainerClass ?? [
          'grid',
          {
            'grid-cols-[max-content,1fr,max-content]':
              $slots['slot-left'] && $slots['slot-right'],
            'grid-cols-[1fr,max-content]':
              !$slots['slot-left'] && $slots['slot-right'],
            'grid-cols-[max-content,1fr]':
              $slots['slot-left'] && !$slots['slot-right'],
          },
          'ring ring-inset rounded-md',
        ]
      "
      :disabled="disabled"
      :use-input-group="useInputGroup"
    >
      <InputGroupAddon v-if="$slots['slot-left']" :disabled="props.disabled">
        <slot name="slot-left" />
      </InputGroupAddon>

      <InputNumber
        v-model="modelValue"
        :id="inputId"
        :key="inputKey"
        :class="inputNumberClasses"
        :disabled="disabled"
        :placeholder="placeholder"
        :unstyled="unstyled"
        :show-buttons="false"
        :max="max as number"
        :min="min as number"
        :mode="mode"
        :use-grouping="useGrouping"
        :size="size"
      />
      <InputGroupAddon v-if="$slots['slot-right']" :disabled="props.disabled">
        <slot name="slot-right" />
      </InputGroupAddon>
    </InputGroup>
  </FieldWrapper>
</template>
