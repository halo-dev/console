import { definePlugin } from "@halo-dev/console-shared";
import BasicLayout from "@/layouts/BasicLayout.vue";
import Dashboard from "./Dashboard.vue";
import { IconDashboard } from "@halo-dev/components";

import CommentStatsWidget from "./widgets/CommentStatsWidget.vue";
import PostStatsWidget from "./widgets/PostStatsWidget.vue";
import QuickLinkWidget from "./widgets/QuickLinkWidget.vue";
import RecentLoginWidget from "./widgets/RecentLoginWidget.vue";
import RecentPublishedWidget from "./widgets/RecentPublishedWidget.vue";
import UserStatsWidget from "./widgets/UserStatsWidget.vue";
import ViewsStatsWidget from "./widgets/ViewsStatsWidget.vue";
import { markRaw } from "vue";

export default definePlugin({
  name: "dashboardModule",
  components: [
    CommentStatsWidget,
    PostStatsWidget,
    QuickLinkWidget,
    RecentLoginWidget,
    RecentPublishedWidget,
    UserStatsWidget,
    ViewsStatsWidget,
  ],
  routes: [
    {
      path: "/",
      component: BasicLayout,
      name: "Root",
      redirect: "/dashboard",
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
          meta: {
            title: "仪表盘",
            searchable: true,
            menu: {
              name: "仪表盘",
              group: "dashboard",
              icon: markRaw(IconDashboard),
              priority: 0,
              mobile: true,
            },
          },
        },
      ],
    },
  ],
});
