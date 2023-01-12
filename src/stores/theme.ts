import { apiClient } from "@/utils/api-client";
import type { Theme } from "@halo-dev/api-client";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const activatedTheme = ref<Theme>();

  async function fetchActivatedTheme() {
    try {
      const { data } = await apiClient.theme.fetchActivatedTheme({
        mute: true,
      });

      activatedTheme.value = data;
    } catch (e) {
      console.error("Failed to fetch active theme", e);
    }
  }

  return { activatedTheme, fetchActivatedTheme };
});
