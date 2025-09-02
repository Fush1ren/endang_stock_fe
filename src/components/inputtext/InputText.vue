<script setup lang="ts">
import { InputGroupAddon, InputText } from 'primevue';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import InputGroup from '../inputgroup/InputGroup.vue';
import type { InputTextEmits, InputTextProps } from './InputText.vue.d';
import { computed, onMounted, reactive, ref, shallowRef, watch } from 'vue';
import type { ValueNull } from '../../types/data.type';

type Field = {
  value: ValueNull<string>;
};

const props = withDefaults(defineProps<InputTextProps>(), {
  type: 'text',
  useInputGroup: true,
});

const field = reactive<Field>({
  value: undefined,
});

const emit = defineEmits<InputTextEmits>();

const inputKey = shallowRef(0);

const tempValue = shallowRef<ValueNull<string>>(
  props.value || props.modelValue,
);

const defaultMax = ref<number>(30);

onMounted(() => {
  if (props.modelValue != null) field.value = props.modelValue?.trim();
});

const inputTextClasses = computed(() => [
  '!text-sm !text-black',
  'placeholder:!font-light',
  '!appearance-none',
  '!px-2 !py-[5px] w-full !bg-transparent !border-gray-200 !border-2 !rounded-sm !outline-none',
  'focus:ring-0 focus:!border-none focus:!outline-none focus:!shadow-none focus:!border-0 focus:!border-transparent',
  `input-${props.label}`,
  props.inputClass,
]);

const inputPlaceholder = computed(() => {
  if (props.placeholder) {
    return props?.placeholder;
  }
  return props.label ? `Enter ${props.label}` : '';
});

const onBlurInput = (): void => {
  emit('blur', tempValue.value);
};

const handleKeypress = (event: KeyboardEvent): void => {
  const maxLength = props.maxLength || defaultMax.value;
  const isMaxLengthReached = maxLength === tempValue.value?.length;

  if (isMaxLengthReached && props.preventInputOnMaxLength) {
    event.preventDefault();

    if (isMaxLengthReached) {
      inputKey.value++;
    }
  }
};

const onUpdateModelValue = (e?: string): void => {
  if (e === '') e = undefined;

  if (props.autoUppercase && e) {
    e = e.replace(/[a-z]/g, (char) => char.toUpperCase());
  }

  tempValue.value = e;

  emit('update:modelValue', tempValue.value);
};

const onInput = (event: Event): void => {
  emit('input', (event?.target as HTMLInputElement)?.value || undefined);
};

const assignFieldValue = (value?: string): void => {
  field.value = value?.trim();
};

watch(
  () => props.value,
  (newValue) => {
    assignFieldValue(newValue);
    tempValue.value = newValue?.trim();
  },
  { once: true },
);

watch(
  () => props.modelValue,
  (value) => {
    tempValue.value = value?.trim();
    field.value = tempValue.value;
  },
);
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

      <InputText
        :id="inputId"
        :key="inputKey"
        :class="inputTextClasses"
        :disabled="disabled"
        :model-value="field.value"
        :placeholder="inputPlaceholder"
        :type="type"
        :unstyled="unstyled"
        @blur="onBlurInput"
        @input="onInput"
        @keypress="handleKeypress"
        @update:model-value="onUpdateModelValue"
      />
      <InputGroupAddon v-if="$slots['slot-right']" :disabled="props.disabled">
        <slot name="slot-right" />
      </InputGroupAddon>
    </InputGroup>
  </FieldWrapper>
</template>
