<script setup lang="ts">
import Dialog from 'primevue/dialog';
import type { DialogEmits, DialogProps } from './Dialog.vue.d';
import Button from '../button/Button.vue';
import Checkbox from '../checkbox/Checkbox.vue';
import { ref, watch } from 'vue';

const modelValue = defineModel<boolean>('visible', {
  default: false,
});
const emit = defineEmits<DialogEmits>();

const props = withDefaults(defineProps<DialogProps>(), {
  closable: true,
  unstyled: false,
  draggable: false,
  useSubmit: true,
  useClose: true,
  useStay: true,
});

const stayModel = ref<boolean>(false);

const onSubmit = (e?: PointerEvent | Event): void => {
  emit('submit', {
    event: e as PointerEvent | Event,
    stay: stayModel.value,
  });
};

const onClose = (e: Event): void => {
  emit('close', e);
  emit('update:visible', false);
};

watch(
  () => modelValue.value,
  () => {
    if (!modelValue.value) {
      stayModel.value = false;
    }
  },
);
</script>
<template>
  <Dialog
    v-bind="props"
    v-model:visible="modelValue"
    :pt="{
      root: {
        class: [
          'flex flex-col',
          'px-2 pb-2',
          'gap-1',
          'bg-white',
          'transform',
          'scale-100',
          ...(Array.isArray($props.class) ? $props.class : [$props.class]),
        ],
      },
      header: {
        class: [
          'flex items-center justify-between gap-2',
          'shrink-0',
          'rounded-tl-lg',
          'rounded-tr-lg',
          'text-black font-bold',
          '!pb-2 !pr-1',
        ],
      },
      headerActions: {
        class: ['!hover:bg-gray-200'],
      },
      pcCloseButton: {
        root: {
          class: ['hover:cursor-pointer', 'hover:bg-gray-50!'],
        },
      },
      content: {
        class: [
          'flex flex-col gap-3',
          'overflow-y-auto scrollbar-w-none !px-[20px] !py-0',
          'text-black',
        ],
      },
      footer: {
        class: ['!pb-2'],
      },
    }"
    modal
  >
    <template #default>
      <form class="w-full" @submit.prevent="onSubmit">
        <slot />
      </form>
    </template>
    <template #footer>
      <slot name="footer">
        <div class="flex flex-col gap-3 justify-end pt-2">
          <div class="flex justify-end">
            <Checkbox
              v-if="props.useStay"
              v-model:model-value="stayModel"
              label="Tetap di sini?"
            />
          </div>
          <div class="flex gap-2 justify-end">
            <Button
              v-if="props.useClose"
              @click="onClose"
              label="Tutup"
              severity="secondary"
            />
            <Button
              v-if="props.useSubmit"
              @click="onSubmit($event as PointerEvent)"
              label="Submit"
              severity="success"
            />
          </div>
        </div>
      </slot>
    </template>
  </Dialog>
</template>
