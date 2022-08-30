<script lang="ts" setup>
import { VModal } from "@halo-dev/components";
import FilePondUpload from "@/components/upload/FilePondUpload.vue";
import { computed, ref, watchEffect } from "vue";
import { apiClient } from "@halo-dev/admin-shared";
import type { Policy } from "@halo-dev/api-client";
import { useFetchAttachmentPolicy } from "../composables/use-attachment-policy";

withDefaults(
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
}>();

const { policies } = useFetchAttachmentPolicy();
const selectedPolicy = ref<Policy | null>(null);
const FilePondUploadRef = ref();

watchEffect(() => {
  if (policies.value.length) {
    selectedPolicy.value = policies.value[0];
  }
});

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
    FilePondUploadRef.value.handleRemoveFiles();
  }
};

const uploadHandler = computed(() => {
  return (file, config) =>
    apiClient.extension.storage.attachment.uploadAttachment(
      file,
      selectedPolicy.value?.metadata.name as string,
      config
    );
});
</script>
<template>
  <VModal
    :body-class="['!p-0']"
    :visible="visible"
    :width="600"
    title="上传附件"
    @update:visible="onVisibleChange"
  >
    <template #actions>
      <FloatingDropdown>
        <div v-tooltip="`选择存储策略`" class="modal-header-action">
          <span class="text-sm">{{ selectedPolicy?.spec.displayName }}</span>
        </div>
        <template #popper>
          <div class="w-72 p-4">
            <ul class="space-y-1">
              <li
                v-for="(policy, index) in policies"
                :key="index"
                v-close-popper
                :class="{
                  '!bg-gray-100 !text-gray-900':
                    selectedPolicy?.metadata.name === policy.metadata.name,
                }"
                class="flex cursor-pointer flex-col rounded px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                @click="selectedPolicy = policy"
              >
                <span class="truncate">
                  {{ policy.spec.displayName }}
                </span>
                <span class="text-xs">
                  {{ policy.spec.templateRef?.name }}
                </span>
              </li>
            </ul>
          </div>
        </template>
      </FloatingDropdown>
    </template>
    <div class="w-full p-4">
      <FilePondUpload
        ref="FilePondUploadRef"
        :allow-multiple="true"
        :handler="uploadHandler"
      />
    </div>
  </VModal>
</template>
