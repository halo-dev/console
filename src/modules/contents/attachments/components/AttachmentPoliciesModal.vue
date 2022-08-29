<script lang="ts" setup>
import {
  IconAddCircle,
  IconMore,
  VButton,
  VModal,
  VSpace,
} from "@halo-dev/components";
import AttachmentLocalStrategyEditingModal from "./AttachmentLocalStrategyEditingModal.vue";
import AttachmentAliOSSStrategyEditingModal from "./AttachmentAliOSSStrategyEditingModal.vue";
import { onMounted, ref } from "vue";
import type { Policy } from "@halo-dev/api-client";
import { apiClient } from "@halo-dev/admin-shared";

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
const loading = ref<boolean>(false);

const localStrategyVisible = ref(false);
const aliOSSStrategyVisible = ref(false);

const handleFetchPolicies = async () => {
  try {
    loading.value = true;
    const { data } =
      await apiClient.extension.storage.policy.liststorageHaloRunV1alpha1Policy();
    policies.value = data.items;
  } catch (e) {
    console.error("Failed to fetch attachment policies", e);
  } finally {
    loading.value = false;
  }
};

function onVisibleChange(visible: boolean) {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
}

const handleOpenEditingModal = (policy: Policy) => {
  selectedPolicy.value = policy;
  localStrategyVisible.value = true;
};

onMounted(handleFetchPolicies);
</script>
<template>
  <VModal
    :visible="visible"
    :width="750"
    title="存储策略"
    @update:visible="onVisibleChange"
  >
    <template #actions>
      <FloatingDropdown>
        <div v-tooltip="`添加存储策略`" class="modal-header-action">
          <IconAddCircle />
        </div>
        <template #popper>
          <div class="w-72 p-4">
            <ul class="space-y-1">
              <li
                v-close-popper
                class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                @click="localStrategyVisible = true"
              >
                <span class="truncate">本地</span>
              </li>
              <li
                v-close-popper
                class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                @click="aliOSSStrategyVisible = true"
              >
                <span class="truncate">阿里云 OSS</span>
              </li>
              <li
                v-close-popper
                class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <span class="truncate">Amazon S3</span>
              </li>
            </ul>
          </div>
        </template>
      </FloatingDropdown>
    </template>
    <ul class="box-border h-full w-full divide-y divide-gray-100" role="list">
      <li v-for="(policy, index) in policies" :key="index">
        <div
          class="relative block cursor-pointer px-4 py-3 transition-all hover:bg-gray-50"
        >
          <div class="relative flex flex-row items-center">
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row">
                <span
                  class="mr-0 truncate text-sm font-medium text-gray-900 sm:mr-2"
                >
                  {{ policy.spec.displayName }}
                </span>
              </div>
              <div class="mt-1 flex">
                <span class="text-xs text-gray-500">
                  {{ policy.spec.settingRef }} / {{ policy.spec.configMapRef }}
                </span>
              </div>
            </div>
            <div class="flex">
              <div
                class="inline-flex flex-col flex-col-reverse items-end gap-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <time class="text-sm text-gray-500">
                  {{ policy.metadata.creationTimestamp }}
                </time>
                <span class="cursor-pointer">
                  <FloatingDropdown>
                    <IconMore />
                    <template #popper>
                      <div class="w-48 p-2">
                        <VSpace class="w-full" direction="column">
                          <VButton
                            v-close-popper
                            block
                            type="secondary"
                            @click="handleOpenEditingModal(policy)"
                          >
                            编辑
                          </VButton>
                          <VButton v-close-popper block type="danger">
                            删除
                          </VButton>
                        </VSpace>
                      </div>
                    </template>
                  </FloatingDropdown>
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <template #footer>
      <VButton @click="onVisibleChange(false)">关闭 Esc</VButton>
    </template>
  </VModal>

  <AttachmentLocalStrategyEditingModal
    v-model:visible="localStrategyVisible"
    :policy="selectedPolicy"
    @close="handleFetchPolicies"
  />
  <AttachmentAliOSSStrategyEditingModal
    v-model:visible="aliOSSStrategyVisible"
  />
</template>
