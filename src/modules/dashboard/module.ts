import type { Plugin } from "@halo-dev/admin-shared";
import { BasicLayout } from "@/layouts";
import Dashboard from "./Dashboard.vue";
import { IconDashboard } from "@halo-dev/components";

import CommentStatsWidget from "./widgets/CommentStatsWidget.vue";
import JournalPublishWidget from "./widgets/JournalPublishWidget.vue";
import PostStatsWidget from "./widgets/PostStatsWidget.vue";
import QuickLinkWidget from "./widgets/QuickLinkWidget.vue";
import RecentLoginWidget from "./widgets/RecentLoginWidget.vue";
import RecentPublishedWidget from "./widgets/RecentPublishedWidget.vue";
import UserStatsWidget from "./widgets/UserStatsWidget.vue";
import ViewsStatsWidget from "./widgets/ViewsStatsWidget.vue";

const dashboardModule: Plugin = {
  name: "dashboardModule",
  components: [
    CommentStatsWidget,
    JournalPublishWidget,
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
      redirect: "/dashboard",
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
        },
      ],
    },
  ],
  menus: [
    {
      name: "",
      items: [
        {
          name: "仪表盘",
          path: "/dashboard",
          icon: IconDashboard,
        },
      ],
    },
  ],
};

export default dashboardModule;
