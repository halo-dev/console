<script lang="ts" setup>
import {
  IconArrowDown,
  IconMessage,
  VButton,
  VCard,
  VPageHeader,
  VPagination,
  VSpace,
  IconCloseCircle,
} from "@halo-dev/components";
import CommentListItem from "./components/CommentListItem.vue";
import ReplyCreationModal from "./components/ReplyCreationModal.vue";
import type { ListedComment, ListedCommentList } from "@halo-dev/api-client";
import { onMounted, ref, watch } from "vue";
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
const selectedComment = ref<ListedComment>();
const selectedCommentNames = ref<string[]>([]);

const replyModal = ref(false);

const handleFetchComments = async () => {
  try {
    const { data } = await apiClient.comment.listComments({
      page: comments.value.page,
      size: comments.value.size,
      approved: selectedApprovedFilterItem.value.value,
      sort: selectedSortFilterItem.value.value,
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

const onTriggerReply = (comment: ListedComment) => {
  selectedComment.value = comment;
  replyModal.value = true;
};

// Selection
const handleCheckAllChange = (e: Event) => {
  const { checked } = e.target as HTMLInputElement;

  if (checked) {
    selectedCommentNames.value =
      comments.value.items.map((comment) => {
        return comment.comment.metadata.name;
      }) || [];
  } else {
    selectedCommentNames.value.length = 0;
  }
};

watch(
  () => selectedCommentNames.value,
  (newValue) => {
    checkAll.value = newValue.length === comments.value.items?.length;
  }
);

onMounted(handleFetchComments);

// Filters
const ApprovedFilterItems: { label: string; value?: boolean }[] = [
  {
    label: "全部",
    value: undefined,
  },
  {
    label: "已审核",
    value: true,
  },
  {
    label: "待审核",
    value: false,
  },
];

type Sort = "LAST_REPLY_TIME" | "REPLY_COUNT" | "CREATE_TIME";

const SortFilterItems: {
  label: string;
  value?: Sort;
}[] = [
  {
    label: "默认",
    value: "LAST_REPLY_TIME",
  },
  {
    label: "回复数",
    value: "REPLY_COUNT",
  },
  {
    label: "创建时间",
    value: "CREATE_TIME",
  },
];
const selectedApprovedFilterItem = ref<{ label: string; value?: boolean }>(
  ApprovedFilterItems[0]
);
const selectedSortFilterItem = ref<{
  label: string;
  value?: Sort;
}>(SortFilterItems[0]);

const handleApprovedFilterItemChange = (filterItem: {
  label: string;
  value?: boolean;
}) => {
  selectedApprovedFilterItem.value = filterItem;
  handleFetchComments();
};

const handleSortFilterItemChange = (filterItem: {
  label: string;
  value?: Sort;
}) => {
  selectedSortFilterItem.value = filterItem;
  handleFetchComments();
};
</script>
<template>
  <ReplyCreationModal v-model:visible="replyModal" :comment="selectedComment" />
  <VPageHeader title="评论">
    <template #icon>
      <IconMessage class="mr-2 self-center" />
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
                @change="handleCheckAllChange"
              />
            </div>
            <div class="flex w-full flex-1 items-center sm:w-auto">
              <div
                v-if="!selectedCommentNames.length"
                class="flex items-center gap-2"
              >
                <FormKit placeholder="输入关键词搜索" type="text"></FormKit>
                <div
                  v-if="selectedApprovedFilterItem.value != undefined"
                  class="group flex cursor-pointer items-center justify-center gap-1 rounded-full bg-gray-200 px-2 py-1 hover:bg-gray-300"
                >
                  <span class="text-xs text-gray-600 group-hover:text-gray-900">
                    状态：{{ selectedApprovedFilterItem.label }}
                  </span>
                  <IconCloseCircle
                    class="h-4 w-4 text-gray-600"
                    @click="
                      handleApprovedFilterItemChange(ApprovedFilterItems[0])
                    "
                  />
                </div>
                <div
                  v-if="selectedSortFilterItem.value != 'LAST_REPLY_TIME'"
                  class="group flex cursor-pointer items-center justify-center gap-1 rounded-full bg-gray-200 px-2 py-1 hover:bg-gray-300"
                >
                  <span class="text-xs text-gray-600 group-hover:text-gray-900">
                    排序：{{ selectedSortFilterItem.label }}
                  </span>
                  <IconCloseCircle
                    class="h-4 w-4 text-gray-600"
                    @click="handleSortFilterItemChange(SortFilterItems[0])"
                  />
                </div>
              </div>
              <VSpace v-else>
                <VButton type="danger">删除</VButton>
              </VSpace>
            </div>
            <div class="mt-4 flex sm:mt-0">
              <VSpace spacing="lg">
                <FloatingDropdown>
                  <div
                    class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                  >
                    <span class="mr-0.5"> 状态 </span>
                    <span>
                      <IconArrowDown />
                    </span>
                  </div>
                  <template #popper>
                    <div class="w-72 p-4">
                      <ul class="space-y-1">
                        <li
                          v-for="(filterItem, index) in ApprovedFilterItems"
                          :key="index"
                          v-close-popper
                          :class="{
                            'bg-gray-100':
                              selectedApprovedFilterItem.value ===
                              filterItem.value,
                          }"
                          class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          @click="handleApprovedFilterItemChange(filterItem)"
                        >
                          <span class="truncate">
                            {{ filterItem.label }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </template>
                </FloatingDropdown>
                <div
                  class="flex cursor-pointer items-center text-sm text-gray-700 hover:text-black"
                >
                  <span class="mr-0.5">评论者</span>
                  <span>
                    <IconArrowDown />
                  </span>
                </div>
                <FloatingDropdown>
                  <div
                    class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                  >
                    <span class="mr-0.5"> 排序 </span>
                    <span>
                      <IconArrowDown />
                    </span>
                  </div>
                  <template #popper>
                    <div class="w-72 p-4">
                      <ul class="space-y-1">
                        <li
                          v-for="(filterItem, index) in SortFilterItems"
                          :key="index"
                          v-close-popper
                          :class="{
                            'bg-gray-100':
                              selectedSortFilterItem.value === filterItem.value,
                          }"
                          class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          @click="handleSortFilterItemChange(filterItem)"
                        >
                          <span class="truncate">
                            {{ filterItem.label }}
                          </span>
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
        <li v-for="(comment, index) in comments.items" :key="index">
          <CommentListItem
            :comment="comment"
            :is-selected="checkAll"
            @reply="onTriggerReply"
            @reload="handleFetchComments"
          >
            <template #checkbox>
              <input
                v-model="selectedCommentNames"
                :value="comment?.comment?.metadata.name"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600"
                name="comment-checkbox"
                type="checkbox"
              />
            </template>
          </CommentListItem>
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
