import { definePlugin } from "@halo-dev/console-shared";
import BasicLayout from "@/layouts/BasicLayout.vue";
import { IconMessage } from "@halo-dev/components";
import CommentList from "./CommentList.vue";

export default definePlugin({
  name: "commentModule",
  components: [],
  routes: [
    {
      path: "/comments",
      component: BasicLayout,
      children: [
        {
          path: "",
          name: "Comments",
          component: CommentList,
          meta: {
            title: "评论",
            searchable: true,
            permissions: ["system:comments:view"],
          },
        },
      ],
    },
  ],
  menus: [
    {
      name: "内容",
      items: [
        {
          name: "评论",
          path: "/comments",
          icon: IconMessage,
        },
      ],
    },
  ],
});
