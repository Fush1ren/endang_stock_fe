<script setup lang="ts">
import { Dialog } from 'primevue';
import type {
  DialogConfirmEmits,
  DialogConfirmProps,
  DialogConfirmSlots,
} from './DialogConfirm.vue.d';
import { computed, ref } from 'vue';
import { getNestedProperyValue } from '@/utils/object.utils';
import Button from '../button/Button.vue';

const props = withDefaults(defineProps<DialogConfirmProps>(), {
  list: undefined,
  listLabel: undefined,
  closeLabel: undefined,
  closeAfterConfirm: true,
  actionable: true,
  showIcon: true,
  showCloseButton: true,
  confirmSeverity: undefined,
  severity: 'error',
  confirmButtonSeverity: 'error',
});

const emit = defineEmits<DialogConfirmEmits>();
defineSlots<DialogConfirmSlots>();

const dialogConfirm = ref();

const closeButtonLabel = computed<string>(() => {
  if (props.closeLabel) return props.closeLabel;
  return props.actionable ? 'Batal' : 'Tutup';
});

const severityColor = computed((): string => {
  switch (props.severity) {
    case 'success':
      return 'text-green-500';
    case 'info':
      return 'text-blue-500';
    case 'warning':
      return 'text-yellow-500';
    case 'error':
    case 'danger':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
});

const closeDialog = (): void => {
  emit('update:visible', false);
  emit('close');
};

const confirm = (_e: PointerEvent): void => {
  emit('confirm');
  if (props.closeAfterConfirm) emit('update:visible', false);
};
</script>

<template>
  <Dialog
    ref="dialogConfirm"
    :closable="false"
    :draggable="false"
    :header="header"
    :pt="{
      root: {
        class: '!w-[clamp(360px,75vw,400px)]',
        style: {
          'max-height': 'calc(100vh - 10rem)',
        },
      },
      header: {
        class:
          '!items-start flex items-center gap-2 shrink-0 rounded-tl-lg rounded-tr-lg text-general-800',
      },
      content: {
        class: [
          '[&_ul]:list-inside [&_ul]:list-disc [&_ul_li]:pl-[6px]',
          '!text-general-800 text-sm font-normal tracking-[0.02em]',
          'pr-1.5 -mr-1.5 pl-1.5 -ml-1.5 pt-1.5 -mt-1.5 !pb-1.5 -mb-1.5',
          'flex flex-col gap-3',
          'text-surface-600',
        ],
      },
      footer: {
        class: [
          'flex items-end justify-end gap-1 !mt-3',
          'flex items-center justify-end',
          'shrink-0',
          'text-right',
          'gap-1 mt-2',

          'border-t-0',
          'rounded-b-lg',

          'bg-inherit',
          'text-surface-700/80',
        ],
      },
    }"
    :visible="props.visible"
    @hide="emit('hide')"
    @update:visible="emit('update:visible', !!$event)"
    close-on-escape
    modal
  >
    <template #header>
      <div />
      <h3 :class="`text-xl font-semibold ${severityColor}`">
        {{ header }}
      </h3>
    </template>
    <template #default>
      <div class="overflow-y-auto scrollbar-thin">
        <ul v-if="list">
          <li :key="index" v-for="(item, index) in list">
            {{
              listLabel && typeof item !== 'string'
                ? getNestedProperyValue(item, listLabel)
                : item
            }}
          </li>
        </ul>
      </div>

      <slot :items="list" name="body">
        <p class="p-1 text-sm font-medium">
          {{ message ?? 'Apa kamu yakin?' }}
        </p>
      </slot>
    </template>

    <template #footer>
      <slot name="footer">
        <Button
          v-if="showCloseButton"
          v-focus
          @click="closeDialog"
          :label="closeButtonLabel ?? 'Tutup'"
          severity="secondary"
        />
        <Button
          v-if="actionable"
          v-focus
          @click="confirm($event as PointerEvent)"
          :label="confirmLabel ?? 'Yakin'"
          :severity="confirmButtonSeverity"
        />
      </slot>
    </template>
  </Dialog>
</template>
<style>
.scrollbar-thin {
  scrollbar-width: inherit;
  scrollbar-color: rgb(203, 204, 207) transparent;
}
</style>
