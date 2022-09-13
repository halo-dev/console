<script lang="ts" setup>
import { VAvatar, VButton, VTag } from "@halo-dev/components";
import Entity from "@/components/entity/Entity.vue";
import EntityField from "@/components/entity/EntityField.vue";
import type { Reply } from "@halo-dev/api-client";
import { formatDatetime } from "@/utils/date";

withDefaults(
  defineProps<{
    reply?: Reply;
  }>(),
  {
    reply: undefined,
  }
);
</script>

<template>
  <Entity class="!px-0 !py-2">
    <template #start>
      <EntityField>
        <template #description>
          <VAvatar
            circle
            :src="reply?.spec.owner.annotations?.avatar"
            size="md"
          ></VAvatar>
        </template>
      </EntityField>
      <EntityField
        class="w-28 min-w-[7rem]"
        :title="reply?.spec.owner.displayName"
        :description="reply?.spec.owner.name"
      ></EntityField>
      <EntityField>
        <template #description>
          <div class="flex flex-col gap-2">
            <div class="w-1/2 text-sm text-gray-900">
              {{ reply?.spec.content }}
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="text-gray-700 hover:text-gray-900"> 回复 </span>
              <div class="flex items-center">
                <VTag>New</VTag>
              </div>
            </div>
          </div>
        </template>
      </EntityField>
    </template>
    <template #end>
      <EntityField
        :description="formatDatetime(reply?.metadata.creationTimestamp)"
      >
      </EntityField>
    </template>
    <template #menuItems>
      <VButton v-close-popper block type="danger"> 删除 </VButton>
    </template>
  </Entity>
</template>
