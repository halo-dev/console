<script lang="ts" setup>
import LazyImage from "@/components/image/LazyImage.vue";
import { useSettingForm } from "@/composables/use-setting-form";
import { useThemeStore } from "@/stores/theme";
import { apiClient } from "@/utils/api-client";
import type { FormKitSchemaCondition, FormKitSchemaNode } from "@formkit/core";
import type { SettingForm, Theme } from "@halo-dev/api-client";
import {
  VModal,
  IconLink,
  IconPalette,
  IconSettings,
  VEntity,
  VEntityField,
  VTag,
  VTabbar,
  VButton,
} from "@halo-dev/components";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    url?: string;
  }>(),
  {
    visible: false,
    title: undefined,
    url: "",
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
}>();

interface SettingTab {
  id: string;
  label: string;
}

const { activatedTheme } = storeToRefs(useThemeStore());

const previewFrame = ref<HTMLIFrameElement | null>(null);
const themes = ref<Theme[]>([] as Theme[]);
const themesVisible = ref(false);
const selectedTheme = ref<Theme>();

const handleFetchThemes = async () => {
  try {
    const { data } = await apiClient.theme.listThemes({
      page: 0,
      size: 0,
      uninstalled: false,
    });
    themes.value = data.items;
  } catch (e) {
    console.error("Failed to fetch themes", e);
  }
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      handleFetchThemes();
      selectedTheme.value = activatedTheme?.value;
    }
  }
);

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

const handleOpenThemes = () => {
  settingsVisible.value = false;
  themesVisible.value = !themesVisible.value;
};

const handleSelect = (theme: Theme) => {
  selectedTheme.value = theme;
};

const previewUrl = computed(() => {
  if (!selectedTheme.value) {
    return "#";
  }
  return `${import.meta.env.VITE_API_URL}/?preview-theme=${
    selectedTheme.value.metadata.name
  }`;
});

// theme settings
const settingTabs = ref<SettingTab[]>([] as SettingTab[]);
const activeSettingTab = ref("");
const settingsVisible = ref(false);

const settingName = computed(() => selectedTheme.value?.spec.settingName);
const configMapName = computed(() => selectedTheme.value?.spec.configMapName);

const {
  setting,
  configMapFormData,
  saving,
  handleFetchConfigMap,
  handleFetchSettings,
  handleSaveConfigMap,
} = useSettingForm(settingName, configMapName);

watch(
  () => selectedTheme.value,
  async () => {
    if (selectedTheme.value) {
      await handleFetchSettings();
      await handleFetchConfigMap();

      if (setting.value) {
        const { forms } = setting.value.spec;
        settingTabs.value = forms.map((item: SettingForm) => {
          return {
            id: item.group,
            label: item.label || "",
          };
        });
      }

      activeSettingTab.value = settingTabs.value[0].id;
    }
  }
);

const handleOpenSettings = () => {
  themesVisible.value = false;
  settingsVisible.value = !settingsVisible.value;
};

const formSchema = computed(() => {
  if (!setting.value) {
    return;
  }
  const { forms } = setting.value.spec;
  return forms.find((item) => item.group === activeSettingTab.value)
    ?.formSchema as (FormKitSchemaCondition | FormKitSchemaNode)[];
});
</script>
<template>
  <VModal
    :body-class="['!p-0']"
    :visible="visible"
    fullscreen
    :title="title"
    :mount-to-body="true"
    @update:visible="onVisibleChange"
  >
    <template #actions>
      <span @click="handleOpenThemes">
        <IconPalette />
      </span>
      <span @click="handleOpenSettings">
        <IconSettings />
      </span>
      <span>
        <a :href="previewUrl" target="_blank">
          <IconLink />
        </a>
      </span>
    </template>
    <div
      class="flex h-full items-center justify-center divide-x divide-gray-100 transition-all"
    >
      <transition
        enter-active-class="transform transition ease-in-out duration-300"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition ease-in-out duration-300"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div
          v-show="themesVisible || settingsVisible"
          class="relative h-full w-96 overflow-y-auto"
        >
          <div v-if="settingsVisible" class="mb-20">
            <VTabbar
              v-model:active-id="activeSettingTab"
              :items="settingTabs"
              class="w-full overflow-x-auto overflow-y-hidden !rounded-none"
              type="outline"
            ></VTabbar>
            <div class="bg-white p-2">
              <div v-for="(tab, index) in settingTabs" :key="index">
                <FormKit
                  v-if="
                    tab.id === activeSettingTab &&
                    configMapFormData &&
                    formSchema
                  "
                  :id="tab.id"
                  :key="tab.id"
                  v-model="configMapFormData[tab.id]"
                  :name="tab.id"
                  :actions="false"
                  :preserve="true"
                  type="form"
                  @submit="handleSaveConfigMap"
                >
                  <FormKitSchema :schema="formSchema" />
                </FormKit>
              </div>
              <div v-permission="['system:configmaps:manage']" class="pt-5">
                <div class="flex justify-start">
                  <VButton
                    :loading="saving"
                    type="secondary"
                    @click="$formkit.submit(activeSettingTab || '')"
                  >
                    保存
                  </VButton>
                </div>
              </div>
            </div>
          </div>
          <ul
            v-if="themesVisible"
            class="box-border h-full w-full divide-y divide-gray-100"
            role="list"
          >
            <li
              v-for="(theme, index) in themes"
              :key="index"
              class="group"
              @click="handleSelect(theme)"
            >
              <VEntity
                :is-selected="
                  selectedTheme?.metadata.name === theme.metadata.name
                "
              >
                <template #start>
                  <VEntityField>
                    <template #description>
                      <div class="w-32">
                        <div
                          class="group aspect-w-4 aspect-h-3 block w-full overflow-hidden rounded border bg-gray-100"
                        >
                          <LazyImage
                            :key="theme.metadata.name"
                            :src="theme.spec.logo"
                            :alt="theme.spec.displayName"
                            classes="pointer-events-none object-cover group-hover:opacity-75"
                          >
                            <template #loading>
                              <div
                                class="flex h-full items-center justify-center object-cover"
                              >
                                <span class="text-xs text-gray-400"
                                  >加载中...</span
                                >
                              </div>
                            </template>
                            <template #error>
                              <div
                                class="flex h-full items-center justify-center object-cover"
                              >
                                <span class="text-xs text-red-400"
                                  >加载异常</span
                                >
                              </div>
                            </template>
                          </LazyImage>
                        </div>
                      </div>
                    </template>
                  </VEntityField>
                  <VEntityField
                    :title="theme.spec.displayName"
                    :description="theme.spec.version"
                  >
                    <template #extra>
                      <VTag
                        v-if="
                          activatedTheme?.metadata.name === theme.metadata.name
                        "
                      >
                        当前启用
                      </VTag>
                    </template>
                  </VEntityField>
                </template>

                <template #end>
                  <VEntityField v-permission="['system:themes:manage']">
                    <template #description>
                      <VButton
                        class="hidden group-hover:inline-flex"
                        size="sm"
                        @click="handleOpenSettings"
                      >
                        设置
                      </VButton>
                    </template>
                  </VEntityField>
                </template>
              </VEntity>
            </li>
          </ul>
          <div v-if="settingsVisible" class="fixed bottom-2 left-2 bg-white">
            <VButton size="md" @click="handleOpenThemes">返回</VButton>
          </div>
        </div>
      </transition>
      <div class="h-full flex-1">
        <iframe
          v-if="visible"
          ref="previewFrame"
          class="h-full w-full border-none transition-all duration-300"
          :src="previewUrl"
        ></iframe>
      </div>
    </div>
  </VModal>
</template>
