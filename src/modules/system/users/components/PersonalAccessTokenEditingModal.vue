<script lang="ts" setup>
import type { NewTokenRequest } from "@halo-dev/api-client";
import { VModal, VButton, VSpace, useDialog } from "@halo-dev/components";
import cloneDeep from "lodash.clonedeep";
import { apiClient } from "@halo-dev/admin-shared";
import { ref, watch } from "vue";
import { reset } from "@formkit/core";
import { setFocus } from "@/formkit/utils/focus";
import { useClipboard } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    visible: boolean;
  }>(),
  {
    visible: false,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
}>();

const dialog = useDialog();

const initialFormState: NewTokenRequest = {
  description: "",
  expiresAt: "",
  scopes: [],
};

const formState = ref<NewTokenRequest>(cloneDeep(initialFormState));
const isPermanent = ref(false);
const saving = ref(false);
const rawToken = ref("");

const { copy } = useClipboard({ source: rawToken });

const handleSave = async () => {
  try {
    saving.value = true;

    if (isPermanent.value) {
      formState.value.expiresAt = undefined;
    } else {
      formState.value.expiresAt = new Date(
        formState.value.expiresAt || new Date()
      ).toISOString();
    }

    const { data } =
      await apiClient.personalAccessToken.createPersonalAccessToken({
        newTokenRequest: formState.value,
      });

    rawToken.value = data.rawToken;

    dialog.success({
      title: "创建成功",
      description: `Token: ${rawToken.value}，此 Token 明文将仅显示一次，请妥善保管。`,
      confirmText: "复制并关闭",
      onConfirm: async () => {
        await copy();
        const closeTimer = setTimeout(() => {
          onVisibleChange(false);
          clearTimeout(closeTimer);
        }, 100);
      },
    });
  } catch (error) {
    console.error("Failed to create or update personal access token", error);
  } finally {
    saving.value = false;
  }
};

const handleResetForm = () => {
  formState.value = cloneDeep(initialFormState);
  isPermanent.value = false;
  reset("pat-form");
};

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      setFocus("descriptionInput");
    } else {
      handleResetForm();
    }
  }
);
</script>

<template>
  <VModal
    title="创建个人令牌"
    :visible="visible"
    :width="600"
    @update:visible="onVisibleChange"
  >
    <FormKit
      id="pat-form"
      :config="{ validationVisibility: 'submit' }"
      :actions="false"
      type="form"
      @submit="handleSave"
    >
      <FormKit
        id="descriptionInput"
        v-model="formState.description"
        label="名称"
        type="text"
        validation="required"
      ></FormKit>
      <FormKit
        v-model="isPermanent"
        label="永久有效"
        type="radio"
        :options="[
          { label: '是', value: true },
          { label: '否', value: false },
        ]"
        validation="required"
      ></FormKit>
      <FormKit
        v-if="!isPermanent"
        v-model="formState.expiresAt"
        label="失效时间"
        type="datetime-local"
        validation="required"
      ></FormKit>
    </FormKit>

    <template #footer>
      <VSpace>
        <VButton
          :loading="saving"
          type="secondary"
          @click="$formkit.submit('pat-form')"
        >
          保存 ⌘ + ↵
        </VButton>
        <VButton @click="onVisibleChange(false)">取消 Esc</VButton>
      </VSpace>
    </template>
  </VModal>
</template>
