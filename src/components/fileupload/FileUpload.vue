<script setup lang="ts">
import PrimeUploadFile from 'primevue/fileupload';
import { ref, watch } from 'vue';
import type {
  FileUploadProps,
  FileUploadEmits,
  InterfaceFileUpload,
} from './FileUpload.vue.d';
import config from '@/config';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import Icon from '../icons/Icon.vue';
import Image from '../image/Image.vue';

const props = withDefaults(defineProps<FileUploadProps>(), {
  mandatory: true,
});
const emit = defineEmits<FileUploadEmits>();

const modelValue = defineModel<File | undefined>('modelValue', {
  default: undefined,
});

const fileupload = ref<InterfaceFileUpload>();
const uploadFile = (): void => {
  fileupload.value?.upload();
};
const urlImage = ref<string>();

const selectFile = (event: { files: File[] }): void => {
  if (event.files.length > 0) {
    const file = event.files[0];
    urlImage.value = URL.createObjectURL(file);
    emit('upload', file);
  }
};

const clearData = (): void => {
  modelValue.value = undefined;
  urlImage.value = undefined;
};

const setModelValue = async (): Promise<void> => {
  if (props.url) {
    const response = await fetch(props.url as string);
    const blob = await response.blob();
    const filename = props.url?.replace(`${config.bucketUrl}`, '');
    const file = new File([blob], filename || 'file', {
      type: blob.type,
    });

    modelValue.value = file;
  }
};

watch(
  () => fileupload.value?.files,
  () => {
    if (fileupload.value?.files) {
      modelValue.value = fileupload.value.files[0] as File;
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => modelValue.value,
  () => {
    if (!modelValue.value) {
      urlImage.value = '';
    }
  },
);

watch(
  () => props.url,
  () => {
    if (props.url) {
      setModelValue();
      urlImage.value = props.url as string;
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <FieldWrapper :label="label" :mandatory="mandatory" :optional="!mandatory">
    <div class="flex flex-row items-center gap-2">
      <PrimeUploadFile
        v-if="!urlImage"
        ref="fileupload"
        accept="image/*"
        mode="basic"
        invalidFileTypeMessage="Tipe file harus berupa gambar"
        :file-limit="1"
        :pt="{
          root: {
            class: 'flex flex-row gap-2 !justify-start !flex-nowrap',
          },
          pcChooseButton: {
            class: ['!p-1'],
            style: {
              padding: '0.5rem',
            },
          },
        }"
        @select="selectFile"
        @upload="uploadFile"
      >
        <template #filelabel>
          <div class="!overflow-hidden">
            <span v-if="modelValue" class="text-xs overflow-hidden">{{
              modelValue?.name
            }}</span>
            <span v-else class="text-xs"> Belum ada file yang dipilih </span>
          </div>
        </template>
      </PrimeUploadFile>
      <Image
        v-else-if="urlImage"
        :src="urlImage as string"
        class="object-cover overflow-hidden w-16 h-16 rounded border"
        type="default"
        :preview="true"
      />
      <Icon
        v-if="urlImage"
        @click="clearData"
        icon="delete-bin"
        class="text-red-500 text-xl"
      />
    </div>
  </FieldWrapper>
</template>
<style>
.p-fileupload-basic {
  flex-wrap: nowrap !important;
}
</style>
