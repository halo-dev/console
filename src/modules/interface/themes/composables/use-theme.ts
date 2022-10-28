import type { ComputedRef, Ref } from "vue";
import { computed, onMounted, ref } from "vue";
import type { Theme } from "@halo-dev/api-client";
import { apiClient } from "@/utils/api-client";
import { Dialog } from "@halo-dev/components";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";

interface useThemeLifeCycleReturn {
  loading: Ref<boolean>;
  isActivated: ComputedRef<boolean>;
  handleActiveTheme: () => void;
}

export function useThemeLifeCycle(
  theme: Ref<Theme | undefined>
): useThemeLifeCycleReturn {
  const loading = ref(false);

  const themeStore = useThemeStore();

  const { activatedTheme } = storeToRefs(themeStore);

  const isActivated = computed(() => {
    return activatedTheme?.value?.metadata.name === theme.value?.metadata.name;
  });

  const handleActiveTheme = async () => {
    Dialog.info({
      title: "是否确认启用当前主题",
      description: theme.value?.spec.displayName,
      onConfirm: async () => {
        try {
          const { data: systemConfigMap } =
            await apiClient.extension.configMap.getv1alpha1ConfigMap({
              name: "system",
            });

          if (systemConfigMap.data) {
            const themeConfigToUpdate = JSON.parse(
              systemConfigMap.data?.theme || "{}"
            );
            themeConfigToUpdate.active = theme.value?.metadata.name;
            systemConfigMap.data["theme"] = JSON.stringify(themeConfigToUpdate);

            await apiClient.extension.configMap.updatev1alpha1ConfigMap({
              name: "system",
              configMap: systemConfigMap,
            });
          }
        } catch (e) {
          console.error("Failed to active theme", e);
        } finally {
          themeStore.fetchActivatedTheme();
        }
      },
    });
  };

  return {
    loading,
    isActivated,
    handleActiveTheme,
  };
}
