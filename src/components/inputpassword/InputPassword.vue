<script setup lang="ts">
import { Password } from 'primevue';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import { shallowRef } from 'vue';
import type { InputPasswordProps } from './InputPassword.vue.d';

const props = withDefaults(defineProps<InputPasswordProps>(), {
  placeholder: 'Enter your password',
  feedback: false,
  label: 'Password',
  toggleMask: true,
  mandatory: true,
});

const modelValue = defineModel<string>('modelValue');

const inputKey = shallowRef(0);
</script>
<template>
  <FieldWrapper
    :label="label"
    :label-class="labelClass"
    :mandatory="mandatory"
    :optional="!mandatory"
  >
    <Password
      v-model:model-value="modelValue"
      v-bind="props"
      :key="inputKey"
      :pt="{
        root: {
          class: ['bg-white w-full !h-[30px]', '!rounded-sm'],
        },
        pcInputText: {
          root: [
            '!text-sm !text-black',
            'placeholder:!font-light',
            '!px-2 !py-[5px] w-full !bg-transparent !border-gray-200 !border-2 !rounded-sm',
            'focus:ring-0 focus:!border-black focus:!outline-none focus:!shadow-none focus:!border-2',
            props.inputClass,
          ],
        },
      }"
    />
  </FieldWrapper>
</template>
