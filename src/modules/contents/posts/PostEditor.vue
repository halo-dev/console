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
import { computed, onMounted, ref } from "vue";
import cloneDeep from "lodash.clonedeep";
import { apiClient } from "@halo-dev/admin-shared";
import { useRouteQuery } from "@vueuse/router";

const name = useRouteQuery("name");

const initialFormState: PostRequest = {
  post: {
    spec: {
      title: "",
      slug: "",
      releaseSnapshot: undefined,
      headSnapshot: undefined,
      baseSnapshot: undefined,
      // @ts-ignore
      owner: undefined,
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
const saving = ref(false);
const publishing = ref(false);

const isUpdateMode = computed(() => {
  return !!formState.value.post.metadata.creationTimestamp;
});

const handleSavePost = async () => {
  try {
    saving.value = true;
    formState.value.content.content = formState.value.content.raw;
    if (isUpdateMode.value) {
      const { data } = await apiClient.post.updateDraftPost(
        formState.value.post.metadata.name,
        formState.value
      );
      formState.value.post = data;
    } else {
      const { data } = await apiClient.post.draftPost(formState.value);
      formState.value.post = data;
      name.value = data.metadata.name;
    }
  } catch (e) {
    alert(`保存异常: ${e}`);
    console.error("Failed to save post", e);
  } finally {
    saving.value = false;
  }
};

const handlePublish = async () => {
  try {
    publishing.value = true;
    await handleSavePost();
    const { data } = await apiClient.post.publishPost(
      formState.value.post.metadata.name
    );
    formState.value.post = data;
  } catch (e) {
    alert(`发布异常: ${e}`);
    console.error("Failed to publish post", e);
  } finally {
    publishing.value = false;
  }
};

const onSettingSaved = async (post: Post) => {
  formState.value.post = post;
};

onMounted(async () => {
  if (name.value) {
    // fetch post
    const { data: post } =
      await apiClient.extension.post.getcontentHaloRunV1alpha1Post(
        name.value as string
      );
    formState.value.post = post;

    if (formState.value.post.spec.headSnapshot) {
      const { data: content } = await apiClient.content.obtainSnapshotContent(
        formState.value.post.spec.headSnapshot
      );
      formState.value.content = content;
    }
  }
});
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
        <VButton
          :loading="saving"
          size="sm"
          type="primary"
          @click="handleSavePost"
        >
          保存
        </VButton>
        <VButton :loading="publishing" type="secondary" @click="handlePublish">
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
