<script lang="ts" setup>
import {
  IconBookRead,
  IconSave,
  IconSettings,
  VButton,
  VPageHeader,
  VSpace,
} from "@halo-dev/components";
import PostSettingModal from "./components/PostSettingModal.vue";
import type { Post, PostRequest } from "@halo-dev/api-client";
import { computed, ref } from "vue";
import cloneDeep from "lodash.clonedeep";
import { apiClient } from "@halo-dev/admin-shared";

const initialFormState: PostRequest = {
  post: {
    spec: {
      title: "",
      releaseSnapshot: undefined,
      headSnapshot: "",
      baseSnapshot: "",
      owner: "",
      template: "",
      cover: "",
      deleted: false,
      published: false,
      publishTime: "",
      pinned: false,
      allowComment: true,
      visible: "PUBLIC",
      version: 1,
      priority: 0,
      excerpt: {
        autoGenerate: true,
        raw: "",
      },
      categories: [],
      tags: [],
      htmlMetas: [],
    },
    apiVersion: "api.halo.run/v1alpha1",
    kind: "Post",
    metadata: {
      name: "",
    },
  },
  content: {
    raw: "",
    content: "",
    rawType: "HTML",
  },
};

const formState = ref<PostRequest>(cloneDeep(initialFormState));
const settingModal = ref(false);

const isUpdateMode = computed(() => {
  return !!formState.value.post.metadata.creationTimestamp;
});

const handleSavePost = async () => {
  try {
    formState.value.post.spec.owner = "ryanwang";

    if (isUpdateMode.value) {
      const { data } = await apiClient.post.updateDraftPost(
        formState.value.post.metadata.name,
        formState.value
      );

      formState.value.post = data;
    } else {
      const { data } = await apiClient.post.draftPost(formState.value);
      formState.value.post = data;
    }
  } catch (e) {
    console.error("Failed to save post", e);
  }
};

const handlePublish = async () => {
  try {
    if (!isUpdateMode.value) {
      await handleSavePost();
    }

    await apiClient.post.publishPost(formState.value.post.metadata.name);
  } catch (e) {
    console.error("Failed to publish post", e);
  }
};

const onSettingSaved = async (post: Post) => {
  formState.value.post = post;
};
</script>

<template>
  <PostSettingModal
    v-model:visible="settingModal"
    :post="formState.post"
    @saved="onSettingSaved"
  />
  <VPageHeader title="文章">
    <template #icon>
      <IconBookRead class="mr-2 self-center" />
    </template>
    <template #actions>
      <VSpace>
        <VButton size="sm" @click="settingModal = true">
          <template #icon>
            <IconSettings class="h-full w-full" />
          </template>
          设置
        </VButton>
        <VButton type="secondary" @click="handlePublish">
          <template #icon>
            <IconSave class="h-full w-full" />
          </template>
          发布
        </VButton>
      </VSpace>
    </template>
  </VPageHeader>
  <div class="editor border-t">
    <RichTextEditor v-model="formState.content.raw" />
  </div>
</template>
