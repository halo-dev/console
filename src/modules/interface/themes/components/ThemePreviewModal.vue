<script lang="ts" setup>
import LazyImage from "@/components/image/LazyImage.vue";
import { useThemeStore } from "@/stores/theme";
import { apiClient } from "@/utils/api-client";
import type { Theme } from "@halo-dev/api-client";
import {
  VModal,
  IconLink,
  IconPalette,
  VEntity,
  VEntityField,
  VTag,
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

const { activatedTheme } = storeToRefs(useThemeStore());

const themesVisible = ref(false);

const themes = ref<Theme[]>([] as Theme[]);
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
      <span @click="themesVisible = !themesVisible">
        <IconPalette />
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
        <div v-show="themesVisible" class="h-full w-96 overflow-y-auto">
          <ul
            class="box-border h-full w-full divide-y divide-gray-100"
            role="list"
          >
            <li
              v-for="(theme, index) in themes"
              :key="index"
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
              </VEntity>
            </li>
          </ul>
        </div>
      </transition>
      <div class="h-full flex-1">
        <iframe
          v-if="visible"
          class="h-full w-full border-none transition-all duration-300"
          :src="previewUrl"
        ></iframe>
      </div>
    </div>
  </VModal>
</template>
