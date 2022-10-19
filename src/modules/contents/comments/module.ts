import { definePlugin } from "@halo-dev/console-shared";
import BasicLayout from "@/layouts/BasicLayout.vue";
import { IconMessage } from "@halo-dev/components";
import CommentList from "./CommentList.vue";
import { markRaw } from "vue";

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
            menu: {
              name: "评论",
              group: "content",
              icon: markRaw(IconMessage),
              priority: 2,
              mobile: true,
            },
          },
        },
      ],
    },
  ],
});
