<script lang="ts" setup>
import {
  IconCheckboxFill,
  VCard,
  VEmpty,
  VSpace,
  VButton,
  IconUpload,
} from "@halo-dev/components";
import { watchEffect, ref } from "vue";
import { isImage } from "@/utils/image";
import { useAttachmentControl } from "../../composables/use-attachment";
import type { AttachmentLike } from "@halo-dev/admin-shared";
import AttachmentUploadModal from "../AttachmentUploadModal.vue";
import AttachmentFileTypeIcon from "../AttachmentFileTypeIcon.vue";

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

const {
  attachments,
  loading,
  selectedAttachments,
  handleFetchAttachments,
  handleSelect,
  isChecked,
} = useAttachmentControl();

const uploadVisible = ref(false);

watchEffect(() => {
  emit("update:selected", Array.from(selectedAttachments.value));
});

await handleFetchAttachments();
</script>
<template>
  <VEmpty
    v-if="!attachments.total && !loading"
    message="当前没有附件，你可以尝试刷新或者上传附件"
    title="当前没有附件"
  >
    <template #actions>
      <VSpace>
        <VButton @click="handleFetchAttachments">刷新</VButton>
        <VButton type="secondary" @click="uploadVisible = true">
          <template #icon>
            <IconUpload class="h-full w-full" />
          </template>
          上传附件
        </VButton>
      </VSpace>
    </template>
  </VEmpty>
  <div
    v-else
    class="mt-2 grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
    role="list"
  >
    <VCard
      v-for="(attachment, index) in attachments.items"
      :key="index"
      :body-class="['!p-0']"
      :class="{
        'ring-1 ring-primary': isChecked(attachment),
      }"
      class="hover:shadow"
      @click.stop="handleSelect(attachment)"
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
          <IconCheckboxFill
            :class="{
              '!text-primary': selectedAttachments.has(attachment),
            }"
            class="mt-1 mr-1 h-6 w-6 cursor-pointer text-white transition-all hover:text-primary"
          />
        </div>
      </div>
    </VCard>
  </div>
  <AttachmentUploadModal
    v-model:visible="uploadVisible"
    @close="handleFetchAttachments"
  />
</template>
