<script setup lang="ts">
import type { MultiRowAttribute } from './MultiRow.vue.d';

const props = defineProps<{
  attributes: MultiRowAttribute[];
}>();
</script>

<template>
  <!-- multirowcontainer -->
  <div :class="`grid grid-cols-1 grid-rows-${props?.attributes?.length}`">
    <!-- multirow -->
    <span
      :key="index"
      v-for="(attribute, index) in attributes as MultiRowAttribute[]"
      :class="`${attribute.class ?? ''} ${index === 0 ? '!h-[35px] flex items-center justify-center px-2' : '!border-t border-black !border-solid !h-[35px] flex items-center justify-center px-2'}`"
    >
      <component
        :is="attribute.bodyComponent!.component"
        v-if="attribute.bodyComponent"
        v-model="attribute.bodyComponent!.model"
        v-bind="attribute.bodyComponent!.props"
        :class="attribute.class"
        :disabled="attribute.bodyComponent!.disabled"
        v-on="
          attribute.bodyComponent!.events ? attribute.bodyComponent!.events : {}
        "
        @click.stop=""
      />
      <template v-else>{{ attribute.value }}</template>
    </span>
  </div>
</template>
