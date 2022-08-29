<script lang="ts" setup>
import { VModal } from "@halo-dev/components";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import { onMounted, ref } from "vue";
import { apiClient } from "@halo-dev/admin-shared";
import type { Policy } from "@halo-dev/api-client";

const FilePond = vueFilePond(FilePondPluginImagePreview);

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

const policies = ref<Policy[]>([] as Policy[]);
const selectedPolicy = ref<Policy | null>(null);

const handleFetchPolicies = async () => {
  try {
    const { data } =
      await apiClient.extension.storage.policy.liststorageHaloRunV1alpha1Policy();
    policies.value = data.items;
    if (policies.value.length) {
      selectedPolicy.value = policies.value[0];
    }
  } catch (e) {
    console.error("Failed to fetch attachment policies", e);
  }
};

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

const server = {
  process: (fieldName, file, metadata, load) => {
    if (!selectedPolicy.value) {
      return;
    }
    apiClient.extension.storage.attachment
      .uploadAttachment(file, selectedPolicy.value?.metadata.name)
      .then((response) => {
        load(response);
      });
    return {};
  },
};

onMounted(handleFetchPolicies);
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
                class="flex cursor-pointer flex-col rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                @click="selectedPolicy = policy"
              >
                <span class="truncate">
                  {{ policy.spec.displayName }}
                </span>
                <span class="text-xs">
                  {{ policy.spec.templateRef?.name }}
                </span>
              </li>
              <li
                class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <span class="truncate">新增存储策略</span>
              </li>
            </ul>
          </div>
        </template>
      </FloatingDropdown>
    </template>
    <div class="w-full p-4">
      <file-pond
        ref="pond"
        :allow-multiple="true"
        :server="server"
        label-idle="Drop files here..."
        name="file"
      />
    </div>
  </VModal>
</template>
