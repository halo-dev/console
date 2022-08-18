<script lang="ts" setup>
import {
  IconAddCircle,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconBookRead,
  IconSettings,
  VButton,
  VCard,
  VPageHeader,
  VPagination,
  VSpace,
  VTag,
} from "@halo-dev/components";
import PostSettingModal from "./components/PostSettingModal.vue";
import PostTag from "../posts/tags/components/PostTag.vue";
import { onMounted, ref, watch } from "vue";
import type { Category, Post, Tag } from "@halo-dev/api-client";
import { apiClient } from "@halo-dev/admin-shared";
import { formatDatetime } from "@/utils/date";
import { useUserFetch } from "@/modules/system/users/composables/use-user";

interface Contributor {
  displayName: string;
  avatar?: string;
  name: string;
}

interface PostResult {
  post: Post;
  categories: Category[];
  tags: Tag[];
  contributors: Contributor[];
}

interface PostList {
  page: number;
  size: number;
  total: number;
  items: Array<PostResult>;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

const posts = ref<PostList>({
  page: 1,
  size: 20,
  total: 0,
  items: [],
  first: true,
  last: false,
  hasNext: false,
  hasPrevious: false,
});
const settingModal = ref(false);
const selectedPost = ref<Post | null>(null);
const checkedAll = ref(false);
const selectedPostNames = ref<string[]>([]);

const { users } = useUserFetch();

const handleFetchPosts = async () => {
  try {
    const { data } = await apiClient.post.listPosts(
      posts.value.page,
      posts.value.size
    );

    // @ts-ignore
    posts.value = data;
  } catch (e) {
    console.error("Failed to fetch posts", e);
  }
};

const handlePaginationChange = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  posts.value.page = page;
  posts.value.size = size;
  handleFetchPosts();
};

const handleOpenSettingModal = (post: Post) => {
  selectedPost.value = post;
  settingModal.value = true;
};

const onSettingModalClose = () => {
  selectedPost.value = null;
  handleFetchPosts();
};

const handleSelectPrevious = async () => {
  const { items, hasPrevious } = posts.value;
  const index = items.findIndex(
    (post) => post.post.metadata.name === selectedPost.value?.metadata.name
  );
  if (index > 0) {
    selectedPost.value = items[index - 1].post;
    return;
  }
  if (index === 0 && hasPrevious) {
    posts.value.page--;
    await handleFetchPosts();
    selectedPost.value = posts.value.items[posts.value.items.length - 1].post;
  }
};

const handleSelectNext = async () => {
  const { items, hasNext } = posts.value;
  const index = items.findIndex(
    (post) => post.post.metadata.name === selectedPost.value?.metadata.name
  );
  if (index < items.length - 1) {
    selectedPost.value = items[index + 1].post;
    return;
  }
  if (index === items.length - 1 && hasNext) {
    posts.value.page++;
    await handleFetchPosts();
    selectedPost.value = posts.value.items[0].post;
  }
};

const checkSelection = (post: Post) => {
  return (
    post.metadata.name === selectedPost.value?.metadata.name ||
    selectedPostNames.value.includes(post.metadata.name)
  );
};

const handleCheckAllChange = (e: Event) => {
  const { checked } = e.target as HTMLInputElement;

  if (checked) {
    selectedPostNames.value =
      posts.value.items.map((post) => {
        return post.post.metadata.name;
      }) || [];
  } else {
    selectedPostNames.value.length = 0;
  }
};

watch(selectedPostNames, (newValue) => {
  checkedAll.value = newValue.length === posts.value.items?.length;
});

onMounted(() => {
  handleFetchPosts();
});
</script>
<template>
  <PostSettingModal
    v-model:visible="settingModal"
    :post="selectedPost"
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
  </PostSettingModal>
  <VPageHeader title="文章">
    <template #icon>
      <IconBookRead class="mr-2 self-center" />
    </template>
    <template #actions>
      <VSpace>
        <VButton :route="{ name: 'Categories' }" size="sm">分类</VButton>
        <VButton :route="{ name: 'Tags' }" size="sm">标签</VButton>
        <VButton :route="{ name: 'PostEditor' }" type="secondary">
          <template #icon>
            <IconAddCircle class="h-full w-full" />
          </template>
          新建
        </VButton>
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
                v-model="checkedAll"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600"
                type="checkbox"
                @change="handleCheckAllChange"
              />
            </div>
            <div class="flex w-full flex-1 sm:w-auto">
              <div v-if="!selectedPostNames.length">
                <FormKit placeholder="输入关键词搜索" type="text"></FormKit>
              </div>
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
                    <span class="mr-0.5">状态</span>
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
                          <span class="truncate">全部</span>
                        </li>
                        <li
                          class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <span class="truncate">已发布</span>
                        </li>
                        <li
                          class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <span class="truncate">草稿</span>
                        </li>
                        <li
                          class="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <span class="truncate">未审核</span>
                        </li>
                      </ul>
                    </div>
                  </template>
                </FloatingDropdown>
                <FloatingDropdown>
                  <div
                    class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                  >
                    <span class="mr-0.5">分类</span>
                    <span>
                      <IconArrowDown />
                    </span>
                  </div>
                  <template #popper>
                    <div class="h-96 w-80 p-4">
                      <FormKit
                        placeholder="输入关键词搜索"
                        type="text"
                      ></FormKit>
                    </div>
                  </template>
                </FloatingDropdown>
                <FloatingDropdown>
                  <div
                    class="flex cursor-pointer select-none items-center text-sm text-gray-700 hover:text-black"
                  >
                    <span class="mr-0.5">标签</span>
                    <span>
                      <IconArrowDown />
                    </span>
                  </div>
                  <template #popper>
                    <div class="h-96 w-80 p-4">
                      <FormKit
                        placeholder="输入关键词搜索"
                        type="text"
                      ></FormKit>
                    </div>
                  </template>
                </FloatingDropdown>
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
        <li v-for="(post, index) in posts.items" :key="index">
          <div
            :class="{
              'bg-gray-100': checkSelection(post.post),
            }"
            class="relative block cursor-pointer px-4 py-3 transition-all hover:bg-gray-50"
          >
            <div
              v-show="checkSelection(post.post)"
              class="absolute inset-y-0 left-0 w-0.5 bg-primary"
            ></div>
            <div class="relative flex flex-row items-center">
              <div class="mr-4 hidden items-center sm:flex">
                <input
                  v-model="selectedPostNames"
                  :value="post.post.metadata.name"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  name="post-checkbox"
                  type="checkbox"
                />
              </div>
              <div class="flex-1">
                <div class="flex flex-col sm:flex-row">
                  <RouterLink
                    :to="{
                      name: 'PostEditor',
                      query: { name: post.post.metadata.name },
                    }"
                  >
                    <span
                      class="mr-0 truncate text-sm font-medium text-gray-900 sm:mr-2"
                    >
                      {{ post.post.spec.title }}
                    </span>
                  </RouterLink>
                  <VSpace class="mt-1 sm:mt-0">
                    <PostTag
                      v-for="(tag, tagIndex) in post.tags"
                      :key="tagIndex"
                      :tag="tag"
                    ></PostTag>
                  </VSpace>
                </div>
                <div class="mt-1 flex">
                  <VSpace>
                    <span class="text-xs text-gray-500">访问量 0</span>
                    <span class="text-xs text-gray-500"> 评论 0 </span>
                  </VSpace>
                </div>
              </div>
              <div class="flex">
                <div
                  class="inline-flex flex-col flex-col-reverse items-end gap-4 sm:flex-row sm:items-center sm:gap-6"
                >
                  <RouterLink
                    v-for="(contributor, index) in post.contributors"
                    :key="index"
                    :to="{
                      name: 'UserDetail',
                      params: { name: contributor.name },
                    }"
                  >
                    <img
                      :alt="contributor.name"
                      :src="contributor.avatar"
                      :title="contributor.displayName"
                      class="hidden h-6 w-6 rounded-full ring-2 ring-white sm:inline-block"
                    />
                  </RouterLink>
                  <time class="text-sm text-gray-500">
                    {{ formatDatetime(post.post.metadata.creationTimestamp) }}
                  </time>
                  <span class="cursor-pointer">
                    <IconSettings
                      @click.stop="handleOpenSettingModal(post.post)"
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
            :page="posts.page"
            :size="posts.size"
            :total="posts.total"
            @change="handlePaginationChange"
          />
        </div>
      </template>
    </VCard>
  </div>
</template>
