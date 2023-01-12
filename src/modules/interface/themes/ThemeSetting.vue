<script lang="ts" setup>
// core libs
import { computed, inject, ref, watch } from "vue";

// components
import { VButton } from "@halo-dev/components";

// types
import type { Ref } from "vue";
import { Setting, type ConfigMap, type Theme } from "@halo-dev/api-client";

// hooks
import { useRouteParams } from "@vueuse/router";
import type { FormKitSchemaCondition, FormKitSchemaNode } from "@formkit/core";
import { apiClient } from "@/utils/api-client";

const group = useRouteParams<string>("group");

const selectedTheme = inject<Ref<Theme | undefined>>("selectedTheme");

// const settingName = computed(() => selectedTheme?.value?.spec.settingName);
// const configMapName = computed(() => selectedTheme?.value?.spec.configMapName);

// const {
//   setting,
//   configMapFormData,
//   saving,
//   handleFetchConfigMap,
//   handleFetchSettings,
//   handleSaveConfigMap,
// } = useSettingForm(settingName, configMapName);

const saving = ref(false);
const setting = ref<Setting>();
const configMap = ref<ConfigMap>();
const configMapFormData = ref<
  Record<string, Record<string, string>> | undefined
>();

const handleFetchSettings = async () => {
  if (!selectedTheme?.value) return;
  const { data } = await apiClient.theme.fetchThemeSetting({
    name: selectedTheme?.value?.metadata.name,
  });

  setting.value = data;
};

const handleFetchConfigMap = async () => {
  if (!selectedTheme?.value) return;
  const { data } = await apiClient.theme.fetchThemeConfig({
    name: selectedTheme?.value?.metadata.name,
  });

  configMap.value = data;

  const { forms } = setting.value?.spec || {};

  forms?.forEach((form) => {
    if (!configMapFormData.value) {
      configMapFormData.value = {};
    }
    configMapFormData.value[form.group] = JSON.parse(data[form.group] || "{}");
  });
};

const handleSaveConfigMap = async () => {
  // TODO
};

const formSchema = computed(() => {
  if (!setting.value) {
    return;
  }
  const { forms } = setting.value.spec;
  return forms.find((item) => item.group === group?.value)?.formSchema as (
    | FormKitSchemaCondition
    | FormKitSchemaNode
  )[];
});

await handleFetchSettings();
await handleFetchConfigMap();

watch(
  () => selectedTheme?.value,
  () => {
    handleFetchSettings();
    handleFetchConfigMap();
  }
);
</script>
<template>
  <Transition mode="out-in" name="fade">
    <div class="bg-white p-4">
      <div>
        <FormKit
          v-if="group && formSchema && configMapFormData"
          :id="group"
          v-model="configMapFormData[group]"
          :name="group"
          :actions="false"
          :preserve="true"
          type="form"
          @submit="handleSaveConfigMap"
        >
          <FormKitSchema
            :schema="formSchema"
            :data="configMapFormData[group]"
          />
        </FormKit>
      </div>
      <div v-permission="['system:configmaps:manage']" class="pt-5">
        <div class="flex justify-start">
          <VButton
            :loading="saving"
            type="secondary"
            @click="$formkit.submit(group || '')"
          >
            保存
          </VButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
