import { definePlugin } from "@halo-dev/console-shared";
import BasicLayout from "@/layouts/BasicLayout.vue";
import Actuator from "./Actuator.vue";

export default definePlugin({
  components: {},
  routes: [
    {
      path: "/actuator",
      component: BasicLayout,
      children: [
        {
          path: "",
          component: Actuator,
          meta: {
            title: "系统信息",
            searchable: true,
          },
        },
      ],
    },
  ],
});
