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
import type { Comment } from "@halo-dev/api-client";
import { onMounted, ref } from "vue";
import { faker } from "@faker-js/faker";

const checkAll = ref(false);

const comments = ref<Comment[]>();

onMounted(() => {
  const result: Comment[] = [];
  for (let i = 0; i <= 50; i++) {
    const content = faker.lorem.paragraph(5);
    result.push({
      metadata: {
        name: faker.datatype.uuid(),
        creationTimestamp: faker.date.recent().toISOString(),
      },
      spec: {
        raw: content,
        content: content,
        subjectRef: {
          kind: "Post",
          name: faker.lorem.words(),
        },
        owner: {
          kind: "Email",
          name: faker.internet.email(),
          displayName: faker.name.fullName(),
          annotations: {
            website: faker.internet.url(),
            avatar: faker.internet.avatar(),
          },
        },
        top: false,
        priority: 0,
        userAgent: faker.internet.userAgent(),
        ipAddress: faker.internet.ip(),
        allowNotification: false,
        approved: true,
        hidden: false,
      },
      kind: "Comment",
      apiVersion: "content.halo.run/v1alpha1",
    });
  }
  comments.value = result;
});
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
        <li v-for="(comment, index) in comments" :key="index">
          <CommentListItem :comment="comment" :is-selected="checkAll" />
        </li>
      </ul>

      <template #footer>
        <div class="bg-white sm:flex sm:items-center sm:justify-end">
          <VPagination :page="1" :size="10" :total="20" />
        </div>
      </template>
    </VCard>
  </div>
</template>
