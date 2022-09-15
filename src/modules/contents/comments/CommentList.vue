<script lang="ts" setup>
import {
  IconArrowDown,
  IconMessage,
  VButton,
  VCard,
  VPageHeader,
  VPagination,
  VSpace,
} from "@halo-dev/components";
import CommentListItem from "./components/CommentListItem.vue";
import type { ListedCommentList } from "@halo-dev/api-client";
import { onMounted, ref } from "vue";
import { apiClient } from "@halo-dev/admin-shared";

const checkAll = ref(false);

const comments = ref<ListedCommentList>({
  page: 1,
  size: 20,
  total: 0,
  items: [],
  first: true,
  last: false,
  hasNext: false,
  hasPrevious: false,
});

const handleFetchComments = async () => {
  try {
    const { data } = await apiClient.comment.listComments({
      sort: "LAST_REPLY_TIME",
      page: comments.value.page,
      size: comments.value.size,
    });
    comments.value = data;
  } catch (error) {
    console.log("Failed to fetch comments", error);
  }
};

const handlePaginationChange = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  comments.value.page = page;
  comments.value.size = size;
  handleFetchComments();
};

onMounted(handleFetchComments);
</script>
<template>
  <VPageHeader title="评论">
    <template #icon>
      <IconMessage class="mr-2 self-center" />
    </template>
    <template #actions>
      <VSpace>
        <VButton type="default">回收站</VButton>
      </VSpace>
    </template>
  </VPageHeader>

  <div class="m-0 md:m-4">
    <VCard :body-class="['!p-0']">
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
                <div
                  class="flex cursor-pointer items-center text-sm text-gray-700 hover:text-black"
                >
                  <span class="mr-0.5">状态</span>
                  <span>
                    <IconArrowDown />
                  </span>
                </div>
                <div
                  class="flex cursor-pointer items-center text-sm text-gray-700 hover:text-black"
                >
                  <span class="mr-0.5">评论者</span>
                  <span>
                    <IconArrowDown />
                  </span>
                </div>
                <div
                  class="flex cursor-pointer items-center text-sm text-gray-700 hover:text-black"
                >
                  <span class="mr-0.5">排序</span>
                  <span>
                    <IconArrowDown />
                  </span>
                </div>
              </VSpace>
            </div>
          </div>
        </div>
      </template>
      <ul class="box-border h-full w-full divide-y divide-gray-100" role="list">
        <li v-for="(comment, index) in comments.items" :key="index">
          <CommentListItem :comment="comment" :is-selected="checkAll" />
        </li>
      </ul>

      <template #footer>
        <div class="bg-white sm:flex sm:items-center sm:justify-end">
          <VPagination
            :page="comments.page"
            :size="comments.size"
            :total="comments.total"
            @change="handlePaginationChange"
          />
        </div>
      </template>
    </VCard>
  </div>
</template>
