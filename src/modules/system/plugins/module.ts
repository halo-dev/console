import type { Plugin } from "@halo-dev/admin-shared";
import { BasicLayout } from "@/layouts";
import PluginList from "./PluginList.vue";
import PluginDetail from "./PluginDetail.vue";
import { IconPlug } from "@halo-dev/components";

const pluginModule: Plugin = {
  name: "pluginModule",
  components: [],
  routes: [
    {
      path: "/plugins",
      component: BasicLayout,
      children: [
        {
          path: "",
          name: "Plugins",
          component: PluginList,
        },
        {
          path: ":id",
          name: "PluginDetail",
          component: PluginDetail,
        },
      ],
    },
  ],
  menus: [
    {
      name: "系统",
      items: [
        {
          name: "插件",
          path: "/plugins",
          icon: IconPlug,
        },
      ],
    },
  ],
};

export default pluginModule;
