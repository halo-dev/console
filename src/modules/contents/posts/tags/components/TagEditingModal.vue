<script lang="ts" setup>
// core libs
import { computed, ref, watch, watchEffect } from "vue";
import { apiClient } from "@halo-dev/admin-shared";

// components
import {
  IconArrowLeft,
  IconArrowRight,
  VButton,
  VModal,
  VSpace,
} from "@halo-dev/components";

// types
import type { Tag } from "@halo-dev/api-client";

// libs
import cloneDeep from "lodash.clonedeep";
import { reset, submitForm } from "@formkit/core";
import { useMagicKeys } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    tag: Tag | null;
  }>(),
  {
    visible: false,
    tag: null,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
  (event: "previous"): void;
  (event: "next"): void;
}>();

const initialFormState: Tag = {
  spec: {
    displayName: "",
    color: "#b16cBe",
    cover: "",
  },
  apiVersion: "content.halo.run/v1alpha1",
  kind: "Tag",
  metadata: {
    name: "",
  },
};

const formState = ref<Tag>(cloneDeep(initialFormState));
const saving = ref(false);

const isUpdateMode = computed(() => {
  return !!formState.value.metadata.creationTimestamp;
});

const handleSaveTag = async () => {
  try {
    saving.value = true;
    if (isUpdateMode.value) {
      await apiClient.extension.tag.updatecontentHaloRunV1alpha1Tag(
        formState.value.metadata.name,
        formState.value
      );
    } else {
      await apiClient.extension.tag.createcontentHaloRunV1alpha1Tag(
        formState.value
      );
    }
    onVisibleChange(false);
  } catch (e) {
    console.error("Failed to create tag", e);
  } finally {
    saving.value = false;
  }
};

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

const { Command_Enter } = useMagicKeys();

watchEffect(() => {
  if (Command_Enter.value && props.visible) {
    submitForm("tag-form");
  }
});

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      formState.value = cloneDeep(initialFormState);
      reset("tag-form");
    }
  }
);

watch(
  () => props.tag,
  (tag) => {
    if (tag) {
      formState.value = cloneDeep(tag);
    }
  }
);
</script>
<template>
  <VModal
    :visible="visible"
    :width="600"
    title="编辑文章标签"
    @update:visible="onVisibleChange"
  >
    <template #actions>
      <div class="modal-header-action" @click="emit('previous')">
        <IconArrowLeft />
      </div>
      <div class="modal-header-action" @click="emit('next')">
        <IconArrowRight />
      </div>
    </template>
    <FormKit id="tag-form" type="form" @submit="handleSaveTag">
      <FormKit
        v-model="formState.spec.displayName"
        label="名称"
        type="text"
        validation="required"
      ></FormKit>
      <FormKit
        v-model="formState.metadata.name"
        help="通常作为标签访问地址标识"
        label="别名"
        type="text"
        validation="required"
      ></FormKit>
      <FormKit
        v-model="formState.spec.color"
        help="需要主题适配以支持"
        label="颜色"
        type="color"
      ></FormKit>
      <FormKit
        v-model="formState.spec.cover"
        help="需要主题适配以支持"
        label="封面图"
        type="text"
      ></FormKit>
    </FormKit>
    <template #footer>
      <VSpace>
        <VButton
          :loading="saving"
          type="secondary"
          @click="$formkit.submit('tag-form')"
        >
          提交 ⌘ + ↵
        </VButton>
        <VButton @click="onVisibleChange(false)">取消 Esc</VButton>
      </VSpace>
    </template>
  </VModal>
</template>
