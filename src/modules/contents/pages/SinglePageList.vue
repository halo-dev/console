<script lang="ts" setup>
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconSettings,
  VButton,
  VCard,
  VPagination,
  VSpace,
  VTag,
} from "@halo-dev/components";
import SinglePageSettingModal from "./components/SinglePageSettingModal.vue";
import { onMounted, ref, watchEffect } from "vue";
import { useUserFetch } from "@/modules/system/users/composables/use-user";
import type {
  ListedSinglePageList,
  SinglePage,
  SinglePageRequest,
} from "@halo-dev/api-client";
import { apiClient } from "@halo-dev/admin-shared";
import { formatDatetime } from "@/utils/date";
import { RouterLink } from "vue-router";

const { users } = useUserFetch();

const singlePages = ref<ListedSinglePageList>({
  page: 1,
  size: 20,
  total: 0,
  items: [],
  first: true,
  last: false,
  hasNext: false,
  hasPrevious: false,
});
const loading = ref(false);
const settingModal = ref(false);
const selectedSinglePage = ref<SinglePage>();
const selectedSinglePageWithContent = ref<SinglePageRequest>();
const checkAll = ref(false);

const handleFetchSinglePages = async () => {
  try {
    loading.value = true;
    const { data } = await apiClient.post.listSinglePages({
      page: singlePages.value.page,
      size: singlePages.value.size,
    });
    singlePages.value = data;
  } catch (error) {
    console.error("Failed to fetch single pages", error);
  } finally {
    loading.value = false;
  }
};

const handlePaginationChange = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  singlePages.value.page = page;
  singlePages.value.size = size;
  handleFetchSinglePages();
};

const handleOpenSettingModal = async (singlePage: SinglePage) => {
  const { data } =
    await apiClient.extension.singlePage.getcontentHaloRunV1alpha1SinglePage({
      name: singlePage.metadata.name,
    });
  selectedSinglePage.value = data;
  settingModal.value = true;
};

const onSettingModalClose = () => {
  selectedSinglePage.value = undefined;
  selectedSinglePageWithContent.value = undefined;
  handleFetchSinglePages();
};

watchEffect(async () => {
  if (
    !selectedSinglePage.value ||
    !selectedSinglePage.value.spec.headSnapshot
  ) {
    return;
  }

  const { data: content } = await apiClient.content.obtainSnapshotContent({
    snapshotName: selectedSinglePage.value.spec.headSnapshot,
  });

  selectedSinglePageWithContent.value = {
    page: selectedSinglePage.value,
    content: content,
  };
});

const handleSelectPrevious = async () => {
  const { items, hasPrevious } = singlePages.value;
  const index = items.findIndex(
    (singlePage) =>
      singlePage.page.metadata.name === selectedSinglePage.value?.metadata.name
  );
  if (index > 0) {
    const { data } =
      await apiClient.extension.singlePage.getcontentHaloRunV1alpha1SinglePage({
        name: items[index - 1].page.metadata.name,
      });
    selectedSinglePage.value = data;
    return;
  }
  if (index === 0 && hasPrevious) {
    singlePages.value.page--;
    await handleFetchSinglePages();
    selectedSinglePage.value =
      singlePages.value.items[singlePages.value.items.length - 1].page;
  }
};

const handleSelectNext = async () => {
  const { items, hasNext } = singlePages.value;
  const index = items.findIndex(
    (singlePage) =>
      singlePage.page.metadata.name === selectedSinglePage.value?.metadata.name
  );
  if (index < items.length - 1) {
    const { data } =
      await apiClient.extension.singlePage.getcontentHaloRunV1alpha1SinglePage({
        name: items[index + 1].page.metadata.name,
      });
    selectedSinglePage.value = data;
    return;
  }
  if (index === items.length - 1 && hasNext) {
    singlePages.value.page++;
    await handleFetchSinglePages();
    selectedSinglePage.value = singlePages.value.items[0].page;
  }
};

onMounted(handleFetchSinglePages);
</script>

<template>
  <SinglePageSettingModal
    v-model:visible="settingModal"
    :single-page="selectedSinglePageWithContent"
    @close="onSettingModalClose"
  >
    <template #actions>
      <div class="modal-header-action" @click="handleSelectPrevious">
        <IconArrowLeft />
      </div>
      <div class="modal-header-action" @click="handleSelectNext">
        <IconArrowRight />
      </div>
    </template>
  </SinglePageSettingModal>
  <VCard :body-class="['!p-0']" class="rounded-none border-none shadow-none">
    <template #header>
      <div class="block w-full bg-gray-50 px-4 py-3">
        <div
          class="relative flex flex-col items-start sm:flex-row sm:items-center"
        >
          <div class="mr-4 hidden items-center sm:flex">
            <input
              v-model="checkAll"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600"
              type="checkbox"
            />
          </div>
          <div class="flex w-full flex-1 sm:w-auto">
            <FormKit
              v-if="!checkAll"
              placeholder="输入关键词搜索"
              type="text"
            ></FormKit>
            <VSpace v-else>
              <VButton type="default">设置</VButton>
              <VButton type="danger">删除</VButton>
            </VSpace>
          </div>
          <div class="mt-4 flex sm:mt-0">
            <VSpace spacing="lg">
              <FloatingDropdown>
                <div
                  class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                >
                  <span class="mr-0.5">作者</span>
                  <span>
                    <IconArrowDown />
                  </span>
                </div>
                <template #popper>
                  <div class="h-96 w-80 p-4">
                    <div class="bg-white">
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
                          class="cursor-pointer py-4 hover:bg-gray-50"
                        >
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center">
                              <input
                                class="h-4 w-4 rounded border-gray-300 text-indigo-600"
                                type="checkbox"
                              />
                            </div>
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
                              <VTag>{{ index + 1 }} 篇</VTag>
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
                  <span class="mr-0.5">排序</span>
                  <span>
                    <IconArrowDown />
                  </span>
                </div>
                <template #popper>
                  <div class="w-72 p-4">
                    <ul class="space-y-1">
                      <li
                        class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span class="truncate">较近发布</span>
                      </li>
                      <li
                        class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span class="truncate">较晚发布</span>
                      </li>
                      <li
                        class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span class="truncate">浏览量最多</span>
                      </li>
                      <li
                        class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span class="truncate">浏览量最少</span>
                      </li>
                      <li
                        class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span class="truncate">评论量最多</span>
                      </li>
                      <li
                        class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span class="truncate">评论量最少</span>
                      </li>
                    </ul>
                  </div>
                </template>
              </FloatingDropdown>
            </VSpace>
          </div>
        </div>
      </div>
    </template>
    <ul class="box-border h-full w-full divide-y divide-gray-100" role="list">
      <li v-for="(singlePage, index) in singlePages.items" :key="index">
        <div
          :class="{
            'bg-gray-100': checkAll,
          }"
          class="relative block cursor-pointer px-4 py-3 transition-all hover:bg-gray-50"
        >
          <div
            v-show="checkAll"
            class="absolute inset-y-0 left-0 w-0.5 bg-primary"
          ></div>
          <div class="relative flex flex-row items-center">
            <div class="mr-4 hidden items-center sm:flex">
              <input
                v-model="checkAll"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600"
                type="checkbox"
              />
            </div>
            <div class="flex-1">
              <div class="flex flex-row items-center">
                <RouterLink
                  :to="{
                    name: 'SinglePageEditor',
                    query: { name: singlePage.page.metadata.name },
                  }"
                >
                  <span
                    class="mr-0 truncate text-sm font-medium text-gray-900 sm:mr-2"
                  >
                    {{ singlePage.page.spec.title }}
                  </span>
                </RouterLink>
                <VTag>{{ singlePage.page.status?.permalink }}</VTag>
              </div>
              <div class="mt-1 flex">
                <VSpace>
                  <span class="text-xs text-gray-500"> 访问量 0 </span>
                  <span class="text-xs text-gray-500"> 评论 0 </span>
                </VSpace>
              </div>
            </div>
            <div class="flex">
              <div
                class="inline-flex flex-col items-end gap-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <RouterLink
                  v-for="(
                    contributor, contributorIndex
                  ) in singlePage.contributors"
                  :key="contributorIndex"
                  :to="{
                    name: 'UserDetail',
                    params: { name: contributor.name },
                  }"
                >
                  <img
                    v-tooltip="contributor.displayName"
                    :alt="contributor.name"
                    :src="contributor.avatar"
                    :title="contributor.displayName"
                    class="hidden h-6 w-6 rounded-full ring-2 ring-white sm:inline-block"
                  />
                </RouterLink>
                <time class="text-sm text-gray-500">
                  {{
                    formatDatetime(singlePage.page.metadata.creationTimestamp)
                  }}
                </time>
                <span>
                  <FloatingDropdown>
                    <IconSettings
                      class="cursor-pointer transition-all hover:text-blue-600"
                    />
                    <template #popper>
                      <div class="w-48 p-2">
                        <VSpace class="w-full" direction="column">
                          <VButton
                            v-close-popper
                            block
                            type="secondary"
                            @click="handleOpenSettingModal(singlePage.page)"
                          >
                            设置
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
      <div class="bg-white sm:flex sm:items-center sm:justify-end">
        <VPagination
          :page="singlePages.page"
          :size="singlePages.size"
          :total="singlePages.total"
          @change="handlePaginationChange"
        />
      </div>
    </template>
  </VCard>
</template>
