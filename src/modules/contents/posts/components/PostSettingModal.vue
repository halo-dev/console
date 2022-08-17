<script lang="ts" setup>
import {
  IconArrowLeft,
  IconArrowRight,
  VButton,
  VModal,
  VSpace,
  VTabItem,
  VTabs,
} from "@halo-dev/components";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import type { Category, Post, Tag } from "@halo-dev/api-client";
import cloneDeep from "lodash.clonedeep";
import { apiClient } from "@halo-dev/admin-shared";

const initialFormState: Post = {
  spec: {
    title: "",
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
  apiVersion: "content.halo.run/v1alpha1",
  kind: "Post",
  metadata: {
    name: "",
  },
};

const props = withDefaults(
  defineProps<{
    visible: boolean;
    post: Post | null;
  }>(),
  {
    visible: false,
    post: null,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
  (event: "saved", post: Post): void;
  (event: "previous"): void;
  (event: "next"): void;
}>();

const settingActiveId = ref("general");
const formState = ref<Post>(cloneDeep(initialFormState));
const saving = ref(false);
const categories = ref<Category[]>([] as Category[]);

const categoriesMap = computed(() => {
  return categories.value.map((category) => {
    return {
      value: category.metadata.name,
      label: category.spec.displayName,
    };
  });
});

const tags = ref<Tag[]>([] as Tag[]);
const tagsMap = computed(() => {
  return tags.value.map((tag) => {
    return {
      value: tag.metadata.name,
      label: tag.spec.displayName,
    };
  });
});

const handleVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

const handleSave = () => {
  emit("saved", formState.value);
  handleVisibleChange(false);
};

const handleFetchCategories = async () => {
  try {
    const { data } =
      await apiClient.extension.category.listcontentHaloRunV1alpha1Category(
        0,
        0
      );
    categories.value = data.items;
  } catch (e) {
    console.error("Failed to fetch categories", e);
  }
};
const handleFetchTags = async () => {
  try {
    const { data } =
      await apiClient.extension.tag.listcontentHaloRunV1alpha1Tag(0, 0);

    tags.value = data.items;
  } catch (e) {
    console.error("Failed to fetch tags", e);
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

onMounted(() => {
  handleFetchCategories();
  handleFetchTags();
});
</script>
<template>
  <VModal
    :visible="visible"
    :width="680"
    title="文章设置"
    @update:visible="handleVisibleChange"
  >
    <template #actions>
      <div class="modal-header-action" @click="emit('previous')">
        <IconArrowLeft />
      </div>
      <div class="modal-header-action" @click="emit('next')">
        <IconArrowRight />
      </div>
    </template>

    <VTabs v-model:active-id="settingActiveId" type="outline">
      <VTabItem id="general" label="常规">
        <FormKit id="basic" :actions="false" :preserve="true" type="form">
          <FormKit
            v-model="formState.spec.title"
            label="标题"
            type="text"
            validation="required"
          ></FormKit>
          <FormKit
            v-model="formState.metadata.name"
            label="别名"
            type="text"
            validation="required"
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
            v-model="formState.spec.excerpt.raw"
            label="摘要"
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
            :options="[
              { label: '是', value: true },
              { label: '否', value: false },
            ]"
            label="是否置顶"
            name="topPriority"
            type="radio"
          ></FormKit>
          <FormKit
            v-model="formState.spec.publishTime"
            label="发表时间"
            type="datetime-local"
          ></FormKit>
          <FormKit
            v-model="formState.spec.template"
            label="自定义模板"
            type="select"
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
