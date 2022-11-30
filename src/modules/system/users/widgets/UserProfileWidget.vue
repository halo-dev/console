<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { VAvatar, VCard } from "@halo-dev/components";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
</script>
<template>
  <VCard class="h-full">
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-center gap-3">
        <div class="inline-flex">
          <VAvatar
            size="lg"
            :src="currentUser?.spec.avatar"
            :alt="currentUser?.spec.displayName"
            circle
          />
        </div>
        <div class="inline-flex flex-col">
          <div class="text-base font-semibold">
            {{ currentUser?.spec.displayName }}
          </div>
          <div class="text-xs text-gray-500">
            @{{ currentUser?.metadata.name }}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-4">
        <div class="flex flex-col items-center justify-center">
          <div class="text-sm tabular-nums text-gray-900">12</div>
          <div class="text-[0.6rem] font-light text-gray-500">文章</div>
        </div>

        <div class="flex flex-col items-center justify-center">
          <div class="text-sm tabular-nums text-gray-900">12</div>
          <div class="text-[0.6rem] font-light text-gray-500">文章</div>
        </div>

        <div class="flex flex-col items-center justify-center">
          <div class="text-sm tabular-nums text-gray-900">12</div>
          <div class="text-[0.6rem] font-light text-gray-500">文章</div>
        </div>

        <div class="flex flex-col items-center justify-center">
          <div class="text-sm tabular-nums text-gray-900">12</div>
          <div class="text-[0.6rem] font-light text-gray-500">文章</div>
        </div>
      </div>
    </div>
  </VCard>
</template>
