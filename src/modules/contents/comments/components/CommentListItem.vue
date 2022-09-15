<script lang="ts" setup>
import {
  useDialog,
  VAvatar,
  VButton,
  VEntity,
  VEntityField,
  VStatusDot,
} from "@halo-dev/components";
import type { ListedComment } from "@halo-dev/api-client";
import { formatDatetime } from "@/utils/date";
import { onMounted, ref } from "vue";
import type { Reply } from "@halo-dev/api-client";
import { faker } from "@faker-js/faker";
import ReplyListItem from "./ReplyListItem.vue";
import { apiClient } from "@halo-dev/admin-shared";

withDefaults(
  defineProps<{
    comment?: ListedComment;
    isSelected?: boolean;
  }>(),
  {
    comment: undefined,
    isSelected: false,
  }
);

const emit = defineEmits<{
  (event: "reload"): void;
}>();

const dialog = useDialog();

const showReplies = ref(false);

const replies = ref<Reply[]>([] as Reply[]);

const handleDelete = async (comment: ListedComment | undefined) => {
  if (!comment) return;
  dialog.warning({
    title: "是否确认删除该评论？",
    description: "删除评论的同时会删除该评论下的所有回复，该操作不可恢复。",
    confirmType: "danger",
    onConfirm: async () => {
      try {
        await apiClient.extension.comment.deletecontentHaloRunV1alpha1Comment({
          name: comment.comment?.metadata.name as string,
        });
      } catch (error) {
        console.log("Failed to delete comment", error);
      } finally {
        emit("reload");
      }
    },
  });
};

onMounted(() => {
  const result: Reply[] = [];

  for (let i = 0; i <= 5; i++) {
    const content = faker.lorem.paragraph(3);
    result.push({
      metadata: {
        name: faker.datatype.uuid(),
        creationTimestamp: faker.date.recent().toISOString(),
      },
      spec: {
        raw: content,
        content: content,
        owner: {
          kind: "Email",
          name: faker.internet.email(),
          displayName: faker.name.fullName(),
          annotations: {
            website: faker.internet.url(),
            avatar: faker.internet.avatar(),
          },
        },
        quoteReply: faker.datatype.uuid(),
        commentName: faker.datatype.uuid(),
        top: false,
        priority: 0,
        userAgent: faker.internet.userAgent(),
        ipAddress: faker.internet.ip(),
        allowNotification: false,
        approved: true,
        hidden: false,
      },
      kind: "Reply",
      apiVersion: "content.halo.run/v1alpha1",
    });
  }

  replies.value = result;
});
</script>

<template>
  <VEntity :is-selected="isSelected">
    <template v-if="showReplies" #prepend>
      <div class="absolute inset-y-0 left-0 w-[1px] bg-black/50"></div>
      <div class="absolute inset-y-0 right-0 w-[1px] bg-black/50"></div>
      <div class="absolute inset-x-0 top-0 h-[1px] bg-black/50"></div>
      <div class="absolute inset-x-0 bottom-0 h-[1px] bg-black/50"></div>
    </template>
    <template #checkbox>
      <input
        :checked="isSelected"
        class="h-4 w-4 rounded border-gray-300 text-indigo-600"
        type="checkbox"
      />
    </template>
    <template #start>
      <VEntityField>
        <template #description>
          <VAvatar
            circle
            :src="comment?.comment?.spec.owner.annotations?.avatar"
            size="md"
          ></VAvatar>
        </template>
      </VEntityField>
      <VEntityField
        class="w-28 min-w-[7rem]"
        :title="comment?.owner?.displayName"
        :description="comment?.owner?.email"
        :route="{
          name: 'UserDetail',
          params: {
            name: comment?.owner?.name,
          },
        }"
      ></VEntityField>
      <VEntityField>
        <template #description>
          <div class="flex flex-col gap-2">
            <div class="w-1/2 text-sm text-gray-900">
              {{ comment?.comment?.spec.content }}
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span
                class="select-none text-gray-700 hover:text-gray-900"
                @click="showReplies = !showReplies"
              >
                {{ comment?.comment?.status?.replyCount || 0 }} 条回复
              </span>
              <VStatusDot state="success" animate text="新回复" />
            </div>
          </div>
        </template>
      </VEntityField>
    </template>
    <template #end>
      <VEntityField title="unknow" description="文章"></VEntityField>
      <VEntityField v-if="comment?.comment?.metadata.deletionTimestamp">
        <template #description>
          <VStatusDot v-tooltip="`删除中`" state="warning" animate />
        </template>
      </VEntityField>
      <VEntityField
        :description="
          formatDatetime(comment?.comment?.metadata.creationTimestamp)
        "
      >
      </VEntityField>
    </template>
    <template #dropdownItems>
      <VButton
        v-close-popper
        block
        type="danger"
        @click="handleDelete(comment)"
      >
        删除
      </VButton>
    </template>

    <template v-if="showReplies" #footer>
      <!-- Replies -->
      <div
        class="ml-8 mt-3 divide-y divide-gray-100 rounded-base border-t border-gray-100 pt-3"
      >
        <ReplyListItem
          v-for="reply in replies"
          :key="reply.metadata.name"
          :reply="reply"
        ></ReplyListItem>
      </div>
    </template>
  </VEntity>
</template>
