<script lang="ts" setup>
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconCheckboxFill,
  IconDatabase2Line,
  IconGrid,
  IconList,
  IconPalette,
  IconSettings,
  IconUpload,
  VButton,
  VCard,
  VPageHeader,
  VPagination,
  VSpace,
  VTag,
} from "@halo-dev/components";
import AttachmentDetailModal from "./components/AttachmentDetailModal.vue";
import AttachmentUploadModal from "./components/AttachmentUploadModal.vue";
import AttachmentPoliciesModal from "./components/AttachmentPoliciesModal.vue";
import AttachmentGroupList from "./components/AttachmentGroupList.vue";
import { onMounted, ref } from "vue";
import { useUserFetch } from "@/modules/system/users/composables/use-user";
import type { Attachment, Group } from "@halo-dev/api-client";
import { formatDatetime } from "@/utils/date";
import prettyBytes from "pretty-bytes";
import { useFetchAttachmentPolicy } from "./composables/use-attachment-policy";
import { useAttachmentControl } from "./composables/use-attachment";
import AttachmentSelectModal from "@/modules/contents/attachments/components/AttachmentSelectModal.vue";
import { apiClient } from "@halo-dev/admin-shared";
import cloneDeep from "lodash.clonedeep";
import { isImage } from "@/utils/image";

const viewTypes = [
  {
    name: "list",
    icon: IconList,
  },
  {
    name: "grid",
    icon: IconGrid,
  },
];

const viewType = ref("grid");

const strategyVisible = ref(false);
const uploadVisible = ref(false);
const detailVisible = ref(false);
const selectVisible = ref(false);

const { users } = useUserFetch();
const { policies } = useFetchAttachmentPolicy();

const {
  attachments,
  selectedAttachment,
  selectedAttachments,
  checkedAll,
  handleFetchAttachments,
  handleSelectNext,
  handleSelectPrevious,
  handlePaginationChange,
  handleDeleteInBatch,
  handleCheckAll,
  handleSelect,
  isChecked,
} = useAttachmentControl();

const groups = ref<Group[]>([] as Group[]);
const selectedGroup = ref<Group>();

const handleFetchGroups = async () => {
  try {
    const { data } =
      await apiClient.extension.storage.group.liststorageHaloRunV1alpha1Group();
    groups.value = data.items;
  } catch (e) {
    console.error("Failed to fetch attachment groups", e);
  }
};

const handleMove = async (group: Group) => {
  try {
    const promises = Array.from(selectedAttachments.value).map((attachment) => {
      const attachmentToUpdate = cloneDeep(attachment);
      attachmentToUpdate.spec.groupRef = {
        name: group.metadata.name,
      };
      return apiClient.extension.storage.attachment.updatestorageHaloRunV1alpha1Attachment(
        attachment.metadata.name,
        attachmentToUpdate
      );
    });

    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
};

const handleClickItem = (attachment: Attachment) => {
  if (selectedAttachments.value.size > 0) {
    handleSelect(attachment);
    return;
  }

  selectedAttachment.value = attachment;
  selectedAttachments.value.clear();
  detailVisible.value = true;
};

const handleCheckAllChange = (e: Event) => {
  const { checked } = e.target as HTMLInputElement;
  handleCheckAll(checked);
};

const onDetailModalClose = () => {
  selectedAttachment.value = undefined;
  handleFetchAttachments();
};

onMounted(handleFetchGroups);
</script>
<template>
  <AttachmentSelectModal v-model:visible="selectVisible">
  </AttachmentSelectModal>
  <AttachmentDetailModal
    v-model:visible="detailVisible"
    :attachment="selectedAttachment"
    @close="onDetailModalClose"
  >
    <template #actions>
      <div class="modal-header-action" @click="handleSelectPrevious">
        <IconArrowLeft />
      </div>
      <div class="modal-header-action" @click="handleSelectNext">
        <IconArrowRight />
      </div>
    </template>
  </AttachmentDetailModal>
  <AttachmentUploadModal
    v-model:visible="uploadVisible"
    @close="handleFetchAttachments"
  />
  <AttachmentPoliciesModal v-model:visible="strategyVisible" />
  <VPageHeader title="附件库">
    <template #icon>
      <IconPalette class="mr-2 self-center" />
    </template>
    <template #actions>
      <VSpace>
        <VButton size="sm" @click="selectVisible = true"> 选择附件</VButton>
        <VButton size="sm" @click="strategyVisible = true">
          <template #icon>
            <IconDatabase2Line class="h-full w-full" />
          </template>
          存储策略
        </VButton>
        <VButton size="sm">
          <template #icon>
            <IconSettings class="h-full w-full" />
          </template>
          设置
        </VButton>
        <VButton type="secondary" @click="uploadVisible = true">
          <template #icon>
            <IconUpload class="h-full w-full" />
          </template>
          上传
        </VButton>
      </VSpace>
    </template>
  </VPageHeader>

  <div class="m-0 md:m-4">
    <div class="flex flex-col gap-2 sm:flex-row">
      <div class="w-full">
        <VCard :body-class="[viewType === 'list' ? '!p-0' : '']">
          <template #header>
            <div class="block w-full bg-gray-50 px-4 py-3">
              <div
                class="relative flex flex-col items-start sm:flex-row sm:items-center"
              >
                <div class="mr-4 hidden items-center sm:flex">
                  <input
                    v-model="checkedAll"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600"
                    type="checkbox"
                    @change="handleCheckAllChange"
                  />
                </div>
                <div class="flex w-full flex-1 sm:w-auto">
                  <FormKit
                    v-if="!selectedAttachments.size"
                    placeholder="输入关键词搜索"
                    type="text"
                  ></FormKit>
                  <VSpace v-else>
                    <VButton type="danger" @click="handleDeleteInBatch">
                      删除
                    </VButton>
                    <FloatingDropdown>
                      <VButton>移动</VButton>
                      <template #popper>
                        <div class="w-72 p-4">
                          <ul class="space-y-1">
                            <li
                              v-for="(group, index) in groups"
                              :key="index"
                              v-close-popper
                              class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              @click="handleMove(group)"
                            >
                              <span class="truncate">
                                {{ group.spec.displayName }}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </template>
                    </FloatingDropdown>
                  </VSpace>
                </div>
                <div class="mt-4 flex sm:mt-0">
                  <VSpace spacing="lg">
                    <FloatingDropdown>
                      <div
                        class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                      >
                        <span class="mr-0.5">存储策略</span>
                        <span>
                          <IconArrowDown />
                        </span>
                      </div>
                      <template #popper>
                        <div class="w-72 p-4">
                          <ul class="space-y-1">
                            <li
                              v-for="(policy, index) in policies"
                              :key="index"
                              v-close-popper
                              class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span class="truncate">
                                {{ policy.spec.displayName }}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </template>
                    </FloatingDropdown>
                    <FloatingDropdown>
                      <div
                        class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                      >
                        <span class="mr-0.5">上传者</span>
                        <span>
                          <IconArrowDown />
                        </span>
                      </div>
                      <template #popper>
                        <div class="h-96 w-80">
                          <div class="bg-white p-4">
                            <!--TODO: Auto Focus-->
                            <FormKit
                              placeholder="输入关键词搜索"
                              type="text"
                            ></FormKit>
                          </div>
                          <div class="mt-2">
                            <ul class="divide-y divide-gray-200" role="list">
                              <li
                                v-for="(user, index) in users"
                                :key="index"
                                v-close-popper
                                class="cursor-pointer hover:bg-gray-50"
                              >
                                <div
                                  class="flex items-center space-x-4 px-4 py-3"
                                >
                                  <div class="flex-shrink-0">
                                    <img
                                      :alt="user.spec.displayName"
                                      :src="user.spec.avatar"
                                      class="h-10 w-10 rounded"
                                    />
                                  </div>
                                  <div class="min-w-0 flex-1">
                                    <p
                                      class="truncate text-sm font-medium text-gray-900"
                                    >
                                      {{ user.spec.displayName }}
                                    </p>
                                    <p class="truncate text-sm text-gray-500">
                                      @{{ user.metadata.name }}
                                    </p>
                                  </div>
                                  <div>
                                    <VTag>{{ index + 1 }} 个</VTag>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </template>
                    </FloatingDropdown>
                    <FloatingDropdown>
                      <div
                        class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                      >
                        <span class="mr-0.5">引用位置</span>
                        <span>
                          <IconArrowDown />
                        </span>
                      </div>
                      <template #popper>
                        <div class="w-72 p-4">
                          <ul class="space-y-1">
                            <li
                              v-close-popper
                              class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span class="truncate">未被引用</span>
                            </li>
                            <li
                              v-close-popper
                              class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span class="truncate">文章</span>
                            </li>
                          </ul>
                        </div>
                      </template>
                    </FloatingDropdown>
                    <FloatingDropdown>
                      <div
                        class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                      >
                        <span class="mr-0.5">排序</span>
                        <span>
                          <IconArrowDown />
                        </span>
                      </div>
                      <template #popper>
                        <div class="w-72 p-4">
                          <ul class="space-y-1">
                            <li
                              v-close-popper
                              class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span class="truncate">较近上传</span>
                            </li>
                            <li
                              v-close-popper
                              class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span class="truncate">较晚上传</span>
                            </li>
                            <li
                              v-close-popper
                              class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span class="truncate">文件大小降序</span>
                            </li>
                            <li
                              v-close-popper
                              class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span class="truncate">文件大小升序</span>
                            </li>
                          </ul>
                        </div>
                      </template>
                    </FloatingDropdown>
                    <div class="flex flex-row gap-2">
                      <div
                        v-for="(item, index) in viewTypes"
                        :key="index"
                        :class="{
                          'bg-gray-200 font-bold text-black':
                            viewType === item.name,
                        }"
                        class="cursor-pointer rounded p-1 hover:bg-gray-200"
                        @click="viewType = item.name"
                      >
                        <component :is="item.icon" />
                      </div>
                    </div>
                  </VSpace>
                </div>
              </div>
            </div>
          </template>

          <div v-if="viewType === 'grid'">
            <AttachmentGroupList
              v-model:selected-group="selectedGroup"
              @select="handleFetchAttachments"
            />
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
                @click="handleClickItem(attachment)"
              >
                <div class="group relative bg-white">
                  <div
                    class="aspect-w-10 aspect-h-8 block h-full w-full cursor-pointer overflow-hidden bg-gray-100"
                  >
                    <img
                      v-if="isImage(attachment.spec.mediaType)"
                      :alt="attachment.spec.displayName"
                      :src="attachment.status?.permalink"
                      class="pointer-events-none object-cover group-hover:opacity-75"
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
                      @click.stop="handleSelect(attachment)"
                    />
                  </div>
                </div>
              </VCard>
            </div>
          </div>

          <ul
            v-if="viewType === 'list'"
            class="box-border h-full w-full divide-y divide-gray-100"
            role="list"
          >
            <li v-for="(attachment, index) in attachments.items" :key="index">
              <div
                :class="{
                  'bg-gray-100': isChecked(attachment),
                }"
                class="relative block cursor-pointer px-4 py-3 transition-all hover:bg-gray-50"
              >
                <div
                  v-show="isChecked(attachment)"
                  class="absolute inset-y-0 left-0 w-0.5 bg-primary"
                ></div>
                <div class="relative flex flex-row items-center">
                  <div class="mr-4 hidden items-center sm:flex">
                    <input
                      :checked="selectedAttachments.has(attachment)"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600"
                      type="checkbox"
                      @click="handleSelect(attachment)"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex flex-col sm:flex-row">
                      <span
                        class="mr-0 truncate text-sm font-medium text-gray-900 sm:mr-2"
                        @click="handleClickItem(attachment)"
                      >
                        {{ attachment.spec.displayName }}
                      </span>
                    </div>
                    <div class="mt-1 flex">
                      <VSpace>
                        <span class="text-xs text-gray-500">
                          {{ attachment.spec.mediaType }}
                        </span>
                        <span class="text-xs text-gray-500">
                          {{ prettyBytes(attachment.spec.size || 0) }}
                        </span>
                      </VSpace>
                    </div>
                  </div>
                  <div class="flex">
                    <div
                      class="inline-flex flex-col flex-col-reverse items-end gap-4 sm:flex-row sm:items-center sm:gap-6"
                    >
                      <img
                        class="hidden h-6 w-6 rounded-full ring-2 ring-white sm:inline-block"
                        src="https://ryanc.cc/avatar"
                      />
                      <time class="text-sm text-gray-500">
                        {{
                          formatDatetime(attachment.metadata.creationTimestamp)
                        }}
                      </time>
                      <span class="cursor-pointer">
                        <IconSettings
                          @click.stop="handleClickItem(attachment)"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <template #footer>
            <div class="bg-white sm:flex sm:items-center sm:justify-end">
              <VPagination
                :page="attachments.page"
                :size="attachments.size"
                :total="attachments.total"
                @change="handlePaginationChange"
              />
            </div>
          </template>
        </VCard>
      </div>
    </div>
  </div>
</template>
