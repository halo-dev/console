<script lang="ts" setup>
import { VButton, VModal, VSpace, VTag } from "@halo-dev/components";
import type { Attachment } from "@halo-dev/api-client";

withDefaults(
  defineProps<{
    visible: boolean;
    attachment: Attachment | null;
  }>(),
  {
    visible: false,
    attachment: null,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
}>();

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};
</script>
<template>
  <VModal
    :title="`附件：${attachment?.spec.displayName || ''}`"
    :visible="visible"
    :width="1000"
    @update:visible="onVisibleChange"
  >
    <template #actions>
      <slot name="actions"></slot>
    </template>
    <div class="overflow-hidden bg-white">
      <div>
        <dl>
          <div
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">预览</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <img
                alt="Preview"
                class="w-full rounded sm:w-1/2"
                src="https://picsum.photos/1000/700?random=1"
              />
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">存储策略</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {{ attachment?.spec.policyRef?.name }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">所在分组</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              // TODO
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">文件名称</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {{ attachment?.spec.displayName }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">文件类型</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {{ attachment?.spec.mediaType }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">文件大小</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {{ attachment?.spec.size }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">上传者</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {{ attachment?.spec.uploadedBy?.name }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">上传时间</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {{ attachment?.metadata.creationTimestamp }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">原始链接</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              // TODO
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm font-medium text-gray-900">引用位置</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul class="mt-2 space-y-2">
                <li>
                  <div
                    class="inline-flex w-96 cursor-pointer flex-row gap-x-3 rounded border p-3 hover:border-primary"
                  >
                    <RouterLink
                      :to="{
                        name: 'Posts',
                      }"
                      class="font-medium text-gray-900 hover:text-blue-400"
                    >
                      Halo 1.5.3 发布了
                    </RouterLink>
                    <div class="text-xs">
                      <VSpace>
                        <VTag>文章</VTag>
                      </VSpace>
                    </div>
                  </div>
                </li>
                <li>
                  <div
                    class="inline-flex w-96 cursor-pointer flex-row gap-x-3 rounded border p-3 hover:border-primary"
                  >
                    <RouterLink
                      :to="{
                        name: 'Posts',
                      }"
                      class="font-medium text-gray-900 hover:text-blue-400"
                    >
                      Halo 1.5.2 发布
                    </RouterLink>
                    <div class="text-xs">
                      <VSpace>
                        <VTag>文章</VTag>
                      </VSpace>
                    </div>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <template #footer>
      <VButton type="default" @click="onVisibleChange(false)">关闭 Esc</VButton>
    </template>
  </VModal>
</template>
