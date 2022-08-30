<script lang="ts" setup>
import {
  IconCheckboxFill,
  VButton,
  VCard,
  VModal,
  VTabItem,
  VTabs,
} from "@halo-dev/components";
import type { Attachment } from "@halo-dev/api-client";
import { useAttachmentControl } from "../composables/use-attachment";
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    visible: boolean;
  }>(),
  {
    visible: false,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
  (event: "select", attachments: Attachment[]): void;
}>();

const activeId = ref("internal");

const {
  attachments,
  selectedAttachments,
  handleFetchAttachments,
  handleSelect,
  isChecked,
  handleReset,
} = useAttachmentControl();

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    handleReset();
    emit("close");
  }
};

const handleConfirm = () => {
  console.log(Array.from(selectedAttachments.value));
  emit("select", Array.from(selectedAttachments.value));
  onVisibleChange(false);
};

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      handleFetchAttachments();
    }
  }
);
</script>
<template>
  <VModal
    :visible="visible"
    :width="1240"
    title="选择附件"
    @update:visible="onVisibleChange"
  >
    <VTabs v-model:active-id="activeId" type="outline">
      <VTabItem id="internal" label="附件库">
        <div
          class="mt-2 grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12"
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
                  alt=""
                  class="pointer-events-none object-cover group-hover:opacity-75"
                  src=""
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
      </VTabItem>
      <VTabItem id="upload" label="上传"></VTabItem>
      <VTabItem id="unsplash" label="Unsplash"></VTabItem>
    </VTabs>
    <template #footer>
      <VButton type="secondary" @click="handleConfirm">确定</VButton>
    </template>
  </VModal>
</template>
