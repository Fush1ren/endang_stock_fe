<script setup lang="ts">
import { Checkbox } from 'primevue';
import type { CheckboxProps } from './Checkbox.vue.d';

const props = withDefaults(defineProps<CheckboxProps>(), {
  binary: true,
  selectable: true,
});

const modelValue = defineModel<typeof props.modelValue>('modelValue');
</script>

<template>
  <template v-if="props.label">
    <label :for="props.label" class="flex items-center gap-2 text-sm">
      <Checkbox
        v-model="modelValue"
        :name="props.label"
        :pt="pt"
        :binary="props.binary"
        :value="props.value"
      />
      <span>{{ props.label }}</span>
    </label>
  </template>
  <template v-else>
    <Checkbox
      v-model="modelValue"
      :name="props.label"
      :pt="pt"
      :binary="props.binary"
      :value="props.value"
    />
  </template>
</template>
