<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { Group } from "@halo-dev/api-client";
import { apiClient } from "@halo-dev/admin-shared";
import { IconAddCircle, IconMore, VButton, VSpace } from "@halo-dev/components";
import AttachmentGroupEditingModal from "./AttachmentGroupEditingModal.vue";

const groups = ref<Group[]>([] as Group[]);
const selectedGroup = ref<Group | null>(null);
const loading = ref<boolean>(false);
const groupEditingModal = ref(false);

const handleFetchGroups = async () => {
  try {
    loading.value = true;
    const { data } =
      await apiClient.extension.storage.group.liststorageHaloRunV1alpha1Group();
    groups.value = data.items;
  } catch (e) {
    console.error("Failed to fetch attachment groups", e);
  } finally {
    loading.value = false;
  }
};

const handleOpenEditingModal = (group: Group) => {
  selectedGroup.value = group;
  groupEditingModal.value = true;
};

onMounted(handleFetchGroups);
</script>
<template>
  <AttachmentGroupEditingModal
    v-model:visible="groupEditingModal"
    :group="selectedGroup"
    @close="handleFetchGroups"
  />
  <div class="mb-5 grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-6">
    <div
      class="flex cursor-pointer items-center rounded-base bg-gray-200 p-2 text-gray-900 transition-all"
    >
      <div class="flex flex-1 items-center">
        <span class="text-sm">全部（212）</span>
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center rounded-base bg-gray-100 p-2 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-900 hover:shadow-sm"
    >
      <div class="flex flex-1 items-center">
        <span class="text-sm">未分组（18）</span>
      </div>
    </div>
    <div
      v-for="(group, index) in groups"
      :key="index"
      class="flex cursor-pointer items-center rounded-base bg-gray-100 p-2 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-900 hover:shadow-sm"
    >
      <div class="flex flex-1 items-center">
        <span class="text-sm">
          {{ group.spec.displayName }}（{{ index * 20 }}）
        </span>
      </div>
      <FloatingDropdown>
        <IconMore />
        <template #popper>
          <div class="w-48 p-2">
            <VSpace class="w-full" direction="column">
              <VButton
                v-close-popper
                block
                type="secondary"
                @click="handleOpenEditingModal(group)"
              >
                重命名
              </VButton>
              <VButton v-close-popper block type="danger"> 删除</VButton>
            </VSpace>
          </div>
        </template>
      </FloatingDropdown>
    </div>
    <div
      v-if="!loading"
      class="flex cursor-pointer items-center rounded-base bg-gray-100 p-2 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-900 hover:shadow-sm"
      @click="groupEditingModal = true"
    >
      <div class="flex flex-1 items-center">
        <span class="text-sm">添加分组</span>
      </div>
      <IconAddCircle />
    </div>
  </div>
</template>
