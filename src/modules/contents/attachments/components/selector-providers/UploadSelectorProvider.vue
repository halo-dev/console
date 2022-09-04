<script lang="ts" setup>
import {
  VEmpty,
  IconCheckboxFill,
  VCard,
  IconDeleteBin,
  useDialog,
} from "@halo-dev/components";

import { apiClient, type AttachmentLike } from "@halo-dev/admin-shared";
import type { Attachment } from "@halo-dev/api-client";
import FilePondUpload from "@/components/upload/FilePondUpload.vue";
import AttachmentFileTypeIcon from "../AttachmentFileTypeIcon.vue";
import { computed, ref, watchEffect } from "vue";
import type { AxiosResponse } from "axios";
import { isImage } from "@/utils/image";

withDefaults(
  defineProps<{
    selected: AttachmentLike[];
  }>(),
  {
    selected: () => [],
  }
);

const emit = defineEmits<{
  (event: "update:selected", attachments: AttachmentLike[]): void;
}>();

const attachments = ref<Set<Attachment>>(new Set<Attachment>());
const selectedAttachments = ref<Set<Attachment>>(new Set<Attachment>());

const uploadHandler = computed(() => {
  return (file, config) =>
    apiClient.extension.storage.attachment.uploadAttachment(
      file,
      "1c00ce7e-dc77-41b6-b5ac-9d825207d6e3",
      undefined,
      config
    );
});

const onUploaded = async (response: AxiosResponse) => {
  const attachment = response.data as Attachment;

  const { data } =
    await apiClient.extension.storage.attachment.getstorageHaloRunV1alpha1Attachment(
      attachment.metadata.name
    );
  attachments.value.add(data);
  selectedAttachments.value.add(data);
};

const handleSelect = async (attachment: Attachment | undefined) => {
  if (!attachment) return;
  if (selectedAttachments.value.has(attachment)) {
    selectedAttachments.value.delete(attachment);
    return;
  }
  selectedAttachments.value.add(attachment);
};

const dialog = useDialog();

const handleDelete = async (attachment: Attachment) => {
  dialog.warning({
    title: "确定要删除当前的附件吗？",
    confirmType: "danger",
    onConfirm: async () => {
      try {
        await apiClient.extension.storage.attachment.deletestorageHaloRunV1alpha1Attachment(
          attachment.metadata.name
        );
        attachments.value.delete(attachment);
        selectedAttachments.value.delete(attachment);
      } catch (e) {
        console.error("Failed to delete attachment", e);
      }
    },
  });
};

watchEffect(() => {
  emit("update:selected", Array.from(selectedAttachments.value));
});
</script>

<template>
  <div class="flex h-full flex-col gap-4 sm:flex-row">
    <div class="h-full w-full overflow-auto sm:w-96">
      <FilePondUpload
        ref="FilePondUploadRef"
        :allow-multiple="true"
        :handler="uploadHandler"
        :max-parallel-uploads="5"
        label-idle="点击选择文件或者拖拽文件到此处"
        @uploaded="onUploaded"
      />
    </div>
    <div class="h-full flex-1 overflow-auto">
      <VEmpty
        v-if="!attachments.size"
        message="当前没有上传的文件，你可以点击左侧区域上传文件"
        title="当前没有上传的文件"
      >
      </VEmpty>
      <div
        v-else
        class="grid grid-cols-3 gap-x-2 gap-y-3 p-0.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6"
        role="list"
      >
        <VCard
          v-for="(attachment, index) in Array.from(attachments)"
          :key="index"
          :body-class="['!p-0']"
          :class="{
            'ring-1 ring-primary': selectedAttachments.has(attachment),
          }"
          class="hover:shadow"
          @click="handleSelect(attachment)"
        >
          <div class="group relative bg-white">
            <div
              class="aspect-w-10 aspect-h-8 block h-full w-full cursor-pointer overflow-hidden bg-gray-100"
            >
              <img
                v-if="isImage(attachment.spec.mediaType)"
                :alt="attachment.spec.displayName"
                class="pointer-events-none object-cover group-hover:opacity-75"
                :src="attachment.status?.permalink"
              />
              <AttachmentFileTypeIcon
                v-else
                :file-name="attachment.spec.displayName"
              />
            </div>
            <p
              class="pointer-events-none block truncate px-2 py-1 text-center text-xs font-medium text-gray-700"
            >
              {{ attachment.spec.displayName }}
            </p>

            <div
              :class="{ '!flex': selectedAttachments.has(attachment) }"
              class="absolute top-0 left-0 hidden h-1/3 w-full justify-end bg-gradient-to-b from-gray-300 to-transparent ease-in-out group-hover:flex"
            >
              <IconDeleteBin
                class="mt-1 mr-1 hidden h-5 w-5 cursor-pointer text-red-400 transition-all hover:text-red-600 group-hover:block"
                @click.stop="handleDelete(attachment)"
              />
              <IconCheckboxFill
                :class="{
                  '!text-primary': selectedAttachments.has(attachment),
                }"
                class="mt-1 mr-1 h-5 w-5 cursor-pointer text-white transition-all hover:text-primary"
              />
            </div>
          </div>
        </VCard>
      </div>
    </div>
  </div>
</template>
