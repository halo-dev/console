<script lang="ts" setup>
import { VModal, Dialog } from "@halo-dev/components";
import UppyUpload from "@/components/upload/UppyUpload.vue";
import { apiClient } from "@/utils/api-client";
import type { Plugin } from "@halo-dev/api-client";
import { ref, watch } from "vue";
import type { SuccessResponse } from "@uppy/core";

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

const uploadVisible = ref(false);

const handleVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

const endpoint = "/apis/api.console.halo.run/v1alpha1/plugins/install";

const onUploaded = async (response: SuccessResponse) => {
  const plugin = response.body as Plugin;
  handleVisibleChange(false);
  Dialog.success({
    title: "上传成功",
    description: "是否启动当前安装的插件？",
    onConfirm: async () => {
      try {
        const { data: pluginToUpdate } =
          await apiClient.extension.plugin.getpluginHaloRunV1alpha1Plugin({
            name: plugin.metadata.name,
          });
        pluginToUpdate.spec.enabled = true;

        await apiClient.extension.plugin.updatepluginHaloRunV1alpha1Plugin({
          name: pluginToUpdate.metadata.name,
          plugin: pluginToUpdate,
        });

        window.location.reload();
      } catch (e) {
        console.error(e);
      }
    },
  });
};

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      uploadVisible.value = true;
    } else {
      const uploadVisibleTimer = setTimeout(() => {
        uploadVisible.value = false;
        clearTimeout(uploadVisibleTimer);
      }, 200);
    }
  }
);
</script>
<template>
  <VModal
    :visible="visible"
    :width="600"
    title="安装插件"
    @update:visible="handleVisibleChange"
  >
    <UppyUpload
      v-if="uploadVisible"
      :restrictions="{
        maxNumberOfFiles: 1,
        allowedFileTypes: ['.jar'],
      }"
      :endpoint="endpoint"
      auto-proceed
      @uploaded="onUploaded"
    />
  </VModal>
</template>
