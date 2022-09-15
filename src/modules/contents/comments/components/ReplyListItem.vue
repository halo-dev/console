<script lang="ts" setup>
import {
  VAvatar,
  VButton,
  VTag,
  VEntityField,
  VEntity,
  useDialog,
  VStatusDot,
} from "@halo-dev/components";
import type { Reply } from "@halo-dev/api-client";
import { formatDatetime } from "@/utils/date";
import { apiClient } from "@halo-dev/admin-shared";

const props = withDefaults(
  defineProps<{
    reply?: Reply;
  }>(),
  {
    reply: undefined,
  }
);

const emit = defineEmits<{
  (event: "reload"): void;
  (event: "reply", reply: Reply): void;
}>();

const dialog = useDialog();

const handleDelete = async () => {
  dialog.warning({
    title: "是否确认删除该回复？",
    description: "该操作不可恢复。",
    confirmType: "danger",
    onConfirm: async () => {
      try {
        await apiClient.extension.reply.deletecontentHaloRunV1alpha1Reply({
          name: props.reply?.metadata.name as string,
        });
      } catch (error) {
        console.log("Failed to delete comment reply", error);
      } finally {
        emit("reload");
      }
    },
  });
};

const handleTriggerReply = () => {
  emit("reply", props.reply);
};
</script>

<template>
  <VEntity class="!px-0 !py-2">
    <template #start>
      <VEntityField>
        <template #description>
          <VAvatar
            circle
            :src="reply?.spec.owner.annotations?.avatar"
            size="md"
          ></VAvatar>
        </template>
      </VEntityField>
      <VEntityField
        class="w-28 min-w-[7rem]"
        :title="reply?.spec.owner.displayName"
        :description="reply?.spec.owner.name"
      ></VEntityField>
      <VEntityField>
        <template #description>
          <div class="flex flex-col gap-2">
            <div class="w-1/2 text-sm text-gray-900">
              {{ reply?.spec.content }}
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span
                class="select-none text-gray-700 hover:text-gray-900"
                @click="handleTriggerReply"
              >
                回复
              </span>
              <div v-if="false" class="flex items-center">
                <VTag>New</VTag>
              </div>
            </div>
          </div>
        </template>
      </VEntityField>
    </template>
    <template #end>
      <VEntityField v-if="reply?.metadata.deletionTimestamp">
        <template #description>
          <VStatusDot v-tooltip="`删除中`" state="warning" animate />
        </template>
      </VEntityField>
      <VEntityField
        :description="formatDatetime(reply?.metadata.creationTimestamp)"
      >
      </VEntityField>
    </template>
    <template #dropdownItems>
      <VButton v-close-popper block type="danger" @click="handleDelete">
        删除
      </VButton>
    </template>
  </VEntity>
</template>
