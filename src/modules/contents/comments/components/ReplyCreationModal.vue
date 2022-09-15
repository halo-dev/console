<script lang="ts" setup>
import { VModal, VSpace, VButton, IconMotionLine } from "@halo-dev/components";
import type { ListedComment, Reply, User } from "@halo-dev/api-client";
// @ts-ignore
import { Picker } from "emoji-mart";
import data from "@emoji-mart/data";
import i18n from "@emoji-mart/data/i18n/zh.json";
import { inject, ref, watch, watchEffect } from "vue";
import { v4 as uuid } from "uuid";
import { reset, submitForm } from "@formkit/core";
import cloneDeep from "lodash.clonedeep";
import { useMagicKeys } from "@vueuse/core";
import { setFocus } from "@/formkit/utils/focus";
import { apiClient } from "@halo-dev/admin-shared";

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    comment?: ListedComment;
    reply?: Reply;
  }>(),
  {
    visible: false,
    comment: undefined,
    reply: undefined,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
}>();

const currentUser = inject<User>("currentUser");

const initialFormState: Reply = {
  spec: {
    raw: "",
    content: "",
    owner: {
      kind: "User",
      name: currentUser?.metadata.name as string,
      displayName: currentUser?.spec.displayName,
    },
    userAgent: navigator.userAgent,
    ipAddress: "",
    priority: 0,
    top: false,
    allowNotification: true,
    approved: false,
    hidden: false,
    commentName: "",
  },
  apiVersion: "content.halo.run/v1alpha1",
  kind: "Reply",
  metadata: {
    name: uuid(),
  },
};

const formState = ref<Reply>(cloneDeep(initialFormState));
const saving = ref(false);

watch(
  () => formState.value.spec.raw,
  (newValue) => {
    formState.value.spec.content = newValue;
  }
);

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

const handleResetForm = () => {
  formState.value = cloneDeep(initialFormState);
  formState.value.metadata.name = uuid();
  reset("comment-reply-form");
};

const { Command_Enter } = useMagicKeys();

watchEffect(() => {
  if (Command_Enter.value && props.visible) {
    submitForm("comment-reply-form");
  }
});

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      formState.value.spec.commentName = props.comment?.comment?.metadata
        .name as string;
      setFocus("contentInput");
    } else {
      handleResetForm();
    }
  }
);

const handleCreateReply = async () => {
  try {
    saving.value = true;
    await apiClient.extension.reply.createcontentHaloRunV1alpha1Reply({
      reply: formState.value,
    });
    onVisibleChange(false);
  } catch (error) {
    console.error("Failed to create comment reply", error);
  } finally {
    saving.value = false;
  }
};

// Emoji picker
const emojiPickerRef = ref<HTMLElement | null>(null);

const handleCreateEmojiPicker = () => {
  const emojiPicker = new Picker({
    data: data,
    theme: "light",
    autoFocus: true,
    i18n: i18n,
    onEmojiSelect: onEmojiSelect,
  });
  emojiPickerRef.value?.appendChild(emojiPicker);
};

const onEmojiSelect = (emoji: { native: string }) => {
  formState.value.spec.raw += emoji.native;
  setFocus("contentInput");
};

watchEffect(() => {
  if (emojiPickerRef.value) {
    handleCreateEmojiPicker();
  }
});
</script>

<template>
  <VModal
    title="回复"
    :visible="visible"
    :width="600"
    @update:visible="onVisibleChange"
  >
    <FormKit
      id="comment-reply-form"
      type="form"
      :config="{ validationVisibility: 'submit' }"
      @submit="handleCreateReply"
    >
      <FormKit
        id="contentInput"
        v-model="formState.spec.raw"
        type="textarea"
        validation="required"
        validation-label="内容"
      ></FormKit>
    </FormKit>
    <div class="mt-2 flex justify-end">
      <FloatingDropdown>
        <IconMotionLine
          class="h-5 w-5 cursor-pointer text-gray-500 transition-all hover:text-gray-900"
        />
        <template #popper>
          <div ref="emojiPickerRef"></div>
        </template>
      </FloatingDropdown>
    </div>
    <template #footer>
      <VSpace>
        <VButton
          type="secondary"
          :loading="saving"
          @click="$formkit.submit('comment-reply-form')"
        >
          保存 ⌘ + ↵
        </VButton>
        <VButton @click="onVisibleChange(false)">取消 Esc</VButton>
      </VSpace>
    </template>
  </VModal>
</template>
