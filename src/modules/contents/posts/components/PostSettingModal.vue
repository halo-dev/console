<script lang="ts" setup>
import { VButton, VModal, VSpace, VTabItem, VTabs } from "@halo-dev/components";
import { computed, ref, watch, watchEffect } from "vue";
import type { Post } from "@halo-dev/api-client";
import cloneDeep from "lodash.clonedeep";
import { usePostTag } from "@/modules/contents/posts/tags/composables/use-post-tag";
import { usePostCategory } from "@/modules/contents/posts/categories/composables/use-post-category";
import { apiClient } from "@halo-dev/admin-shared";
import { v4 as uuid } from "uuid";

const initialFormState: Post = {
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
    publishTime: undefined,
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
  apiVersion: "content.halo.run/v1alpha1",
  kind: "Post",
  metadata: {
    name: uuid(),
  },
};

const props = withDefaults(
  defineProps<{
    visible: boolean;
    post: Post | null;
    onlyEmit: boolean;
  }>(),
  {
    visible: false,
    post: null,
    onlyEmit: false,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
  (event: "saved", post: Post): void;
}>();

const activeTab = ref("general");
const formState = ref<Post>(cloneDeep(initialFormState));
const saving = ref(false);

const { categories } = usePostCategory();
const categoriesMap = computed(() => {
  return categories.value.map((category) => {
    return {
      value: category.metadata.name,
      label: category.spec.displayName,
    };
  });
});

const { tags } = usePostTag();
const tagsMap = computed(() => {
  return tags.value.map((tag) => {
    return {
      value: tag.metadata.name,
      label: tag.spec.displayName,
    };
  });
});

const isUpdateMode = computed(() => {
  return !!formState.value.metadata.creationTimestamp;
});

const handleVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

const handleSave = async () => {
  if (props.onlyEmit) {
    emit("saved", formState.value);
    return;
  }
  try {
    saving.value = true;
    if (isUpdateMode.value) {
      const { data } =
        await apiClient.extension.post.updatecontentHaloRunV1alpha1Post(
          formState.value.metadata.name,
          formState.value
        );
      emit("saved", data);
    } else {
      const { data } =
        await apiClient.extension.post.createcontentHaloRunV1alpha1Post(
          formState.value
        );
      emit("saved", data);
    }
  } catch (e) {
    console.error("Failed to save post", e);
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.post) {
      formState.value = cloneDeep(props.post);
    }
    if (!visible) {
      // TODO
    }
  }
);

watchEffect(() => {
  if (props.post) {
    formState.value = cloneDeep(props.post);
  }
});
</script>
<template>
  <VModal
    :visible="visible"
    :width="700"
    title="文章设置"
    @update:visible="handleVisibleChange"
  >
    <template #actions>
      <slot name="actions"></slot>
    </template>

    <VTabs v-model:active-id="activeTab" type="outline">
      <VTabItem id="general" label="常规">
        <FormKit id="basic" :actions="false" :preserve="true" type="form">
          <FormKit
            v-model="formState.spec.title"
            label="标题"
            type="text"
            validation="required"
          ></FormKit>
          <FormKit
            v-model="formState.spec.slug"
            label="别名"
            name="slug"
            type="text"
            validation="required"
          ></FormKit>
          <FormKit
            v-model="formState.spec.published"
            :options="[
              { label: '已发布', value: true },
              { label: '未发布', value: false },
            ]"
            label="发布状态"
            type="radio"
          ></FormKit>
          <FormKit
            v-model="formState.spec.categories"
            :options="categoriesMap"
            label="分类目录"
            name="categories"
            type="checkbox"
          />
          <FormKit
            v-model="formState.spec.tags"
            :options="tagsMap"
            label="标签"
            name="tags"
            type="checkbox"
          />
          <FormKit
            v-model="formState.spec.excerpt.autoGenerate"
            :options="[
              { label: '是', value: true },
              { label: '否', value: false },
            ]"
            label="自动生成摘要"
            type="radio"
          >
          </FormKit>
          <FormKit
            v-if="!formState.spec.excerpt.autoGenerate"
            v-model="formState.spec.excerpt.raw"
            label="自定义摘要"
            type="textarea"
          ></FormKit>
        </FormKit>
      </VTabItem>
      <VTabItem id="advanced" label="高级">
        <FormKit id="advanced" :actions="false" :preserve="true" type="form">
          <FormKit
            v-model="formState.spec.allowComment"
            :options="[
              { label: '是', value: true },
              { label: '否', value: false },
            ]"
            label="禁止评论"
            type="radio"
          ></FormKit>
          <FormKit
            v-model="formState.spec.pinned"
            :options="[
              { label: '是', value: true },
              { label: '否', value: false },
            ]"
            label="是否置顶"
            name="pinned"
            type="radio"
          ></FormKit>
          <FormKit
            v-model="formState.spec.visible"
            :options="[
              { label: '公开', value: 'PUBLIC' },
              { label: '内部成员可访问', value: 'INTERNAL' },
              { label: '私有', value: 'PRIVATE' },
            ]"
            label="可见性"
            name="visible"
            type="select"
          ></FormKit>
          <FormKit
            v-model="formState.spec.publishTime"
            label="发表时间"
            type="datetime-local"
          ></FormKit>
          <FormKit
            v-model="formState.spec.template"
            label="自定义模板"
            type="text"
          ></FormKit>
          <FormKit
            v-model="formState.spec.cover"
            label="封面图"
            type="text"
          ></FormKit>
        </FormKit>
      </VTabItem>
      <VTabItem id="seo" label="SEO">
        <FormKit id="seo" :actions="false" :preserve="true" type="form">
          <FormKit
            label="自定义关键词"
            name="metaKeywords"
            type="textarea"
          ></FormKit>
          <FormKit
            label="自定义描述"
            name="metaDescription"
            type="textarea"
          ></FormKit>
        </FormKit>
      </VTabItem>
      <VTabItem id="metas" label="元数据"></VTabItem>
      <VTabItem id="inject-code" label="代码注入">
        <FormKit id="inject-code" :actions="false" :preserve="true" type="form">
          <FormKit label="CSS" type="textarea"></FormKit>
          <FormKit label="JavaScript" type="textarea"></FormKit>
        </FormKit>
      </VTabItem>
    </VTabs>

    <template #footer>
      <VSpace>
        <VButton :loading="saving" type="secondary" @click="handleSave">
          保存
        </VButton>
        <VButton type="default" @click="handleVisibleChange(false)">
          取消
        </VButton>
      </VSpace>
    </template>
  </VModal>
</template>
