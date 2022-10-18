import { definePlugin } from "@halo-dev/console-shared";
import SystemSettingsLayout from "./layouts/SystemSettingsLayout.vue";
import SystemSetting from "./SystemSetting.vue";
import { IconSettings } from "@halo-dev/components";
import { markRaw } from "vue";

export default definePlugin({
  name: "settingModule",
  components: [],
  routes: [
    {
      path: "/settings",
      component: SystemSettingsLayout,
      redirect: "/settings/basic",
      meta: {
        title: "系统设置",
        permissions: ["system:settings:view"],
        menu: {
          name: "设置",
          group: "系统",
          icon: markRaw(IconSettings),
          priority: 9,
        },
      },
      children: [
        {
          path: ":group",
          name: "SystemSetting",
          component: SystemSetting,
        },
      ],
    },
  ],
});
