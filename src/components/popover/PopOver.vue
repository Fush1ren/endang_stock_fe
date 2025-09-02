<script setup lang="ts">
import Popover from 'primevue/popover';
import { ref } from 'vue';
import eventBus from '../event-bus';
import type { PopOverProps } from './PopOver.vue.d';

const PopOverElement = ref<InstanceType<typeof Popover> | null>();

const props = withDefaults(defineProps<PopOverProps>(), {
  dismissable: true,
  showCloseIcon: false,
  baseZIndex: 0,
  autoZIndex: true,
  unstyled: false,
  closeOnEscape: true,
});
const POId = +new Date();

const toggle = (event: Event): void => {
  PopOverElement.value?.toggle(event);
};

const show = (event: Event): void => {
  PopOverElement.value?.show(event);
};

const hide = (): void => {
  PopOverElement.value?.hide();
};

const onHidePopOver = (): void => {
  eventBus.off('overlay:show', hidePopOver);
};

const hidePopOver = (event: { overlayId: number }): void => {
  if (PopOverElement.value && event.overlayId !== POId && props.dismissable)
    PopOverElement.value.hide();
};

const onShowPopOver = async (): Promise<void> => {
  eventBus.emit('overlay:show', { POId });
  eventBus.on('overlay:show', hidePopOver);
};

defineExpose({ toggle, hide, show });
</script>
<template>
  <Popover
    v-bind="props"
    :id="POId"
    ref="PopOverElement"
    @hide="onHidePopOver"
    @show="onShowPopOver"
  >
    <slot />
  </Popover>
</template>
<style>
.p-popover::before {
  content: unset !important;
}
.p-popover::after {
  content: unset !important;
}
</style>
