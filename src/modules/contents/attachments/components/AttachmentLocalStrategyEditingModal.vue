<script lang="ts" setup>
import { VButton, VModal, VSpace } from "@halo-dev/components";
import type { Policy } from "@halo-dev/api-client";
import cloneDeep from "lodash.clonedeep";
import { computed, ref, watch, watchEffect } from "vue";
import { apiClient } from "@halo-dev/admin-shared";
import { v4 as uuid } from "uuid";
import { reset, submitForm } from "@formkit/core";
import { useMagicKeys } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    policy: Policy | null;
  }>(),
  {
    visible: false,
    policy: null,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
}>();

const initialFormState: Policy = {
  spec: {
    displayName: "",
    settingRef: "",
    configMapRef: "",
  },
  apiVersion: "storage.halo.run/v1alpha1",
  kind: "Policy",
  metadata: {
    name: "local",
  },
};

const formState = ref<Policy>(cloneDeep(initialFormState));
const saving = ref(false);

const isUpdateMode = computed(() => {
  return !!formState.value.metadata.creationTimestamp;
});

const modalTitle = computed(() => {
  return isUpdateMode.value ? "编辑本地存储策略" : "新增本地存储策略";
});

const handleSave = async () => {
  try {
    saving.value = true;
    if (isUpdateMode.value) {
      await apiClient.extension.storage.policy.updatestorageHaloRunV1alpha1Policy(
        formState.value.metadata.name,
        formState.value
      );
    } else {
      await apiClient.extension.storage.policy.createstorageHaloRunV1alpha1Policy(
        formState.value
      );
    }
    onVisibleChange(false);
  } catch (e) {
    console.error("Failed to save attachment policy", e);
  } finally {
    saving.value = false;
  }
};

const handleResetForm = () => {
  formState.value = cloneDeep(initialFormState);
  formState.value.metadata.name = uuid();
  reset("local-policy-form");
};

const { Command_Enter } = useMagicKeys();

watchEffect(() => {
  if (Command_Enter.value && props.visible) {
    submitForm("local-policy-form");
  }
});

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      handleResetForm();
    }
  }
);

watch(
  () => props.policy,
  (policy) => {
    if (policy) {
      formState.value = cloneDeep(policy);
    } else {
      handleResetForm();
    }
  }
);

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};
</script>
<template>
  <VModal
    :title="modalTitle"
    :visible="visible"
    :width="600"
    @update:visible="onVisibleChange"
  >
    <FormKit id="local-policy-form" type="form" @submit="handleSave">
      <FormKit
        v-model="formState.spec.displayName"
        label="名称"
        type="text"
        validation="required"
      ></FormKit>
      <!--<FormKit label="存储位置" type="text" validation="required"></FormKit>-->
      <!--      <FormKit-->
      <!--        help="使用半角逗号分隔"-->
      <!--        label="允许上传的文件类型"-->
      <!--        type="textarea"-->
      <!--        value="jpg,png,gif"-->
      <!--      ></FormKit>-->
    </FormKit>

    <template #footer>
      <VSpace>
        <VButton
          :loading="saving"
          type="secondary"
          @click="$formkit.submit('local-policy-form')"
        >
          保存 ⌘ + ↵
        </VButton>
        <VButton @click="onVisibleChange(false)">取消 Esc</VButton>
      </VSpace>
    </template>
  </VModal>
</template>
