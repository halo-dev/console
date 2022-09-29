import { BasicLayout, BlankLayout, definePlugin } from "@halo-dev/admin-shared";
import { IconBookRead } from "@halo-dev/components";
import PostList from "./PostList.vue";
import PostEditor from "./PostEditor.vue";
import CategoryList from "./categories/CategoryList.vue";
import TagList from "./tags/TagList.vue";

export default definePlugin({
  name: "postModule",
  components: [],
  routes: [
    {
      path: "/posts",
      component: BasicLayout,
      children: [
        {
          path: "",
          name: "Posts",
          component: PostList,
          meta: {
            title: "文章",
            searchable: true,
            permissions: ["system:posts:view"],
          },
        },
        {
          path: "editor",
          name: "PostEditor",
          component: PostEditor,
          meta: {
            title: "文章编辑",
            searchable: true,
            permissions: ["system:posts:manage"],
          },
        },
        {
          path: "categories",
          component: BlankLayout,
          children: [
            {
              path: "",
              name: "Categories",
              component: CategoryList,
              meta: {
                title: "文章分类",
                searchable: true,
                permissions: ["system:posts:view"],
              },
            },
          ],
        },
        {
          path: "tags",
          component: BlankLayout,
          children: [
            {
              path: "",
              name: "Tags",
              component: TagList,
              meta: {
                title: "文章标签",
                searchable: true,
                permissions: ["system:posts:view"],
              },
            },
          ],
        },
      ],
    },
  ],
  menus: [
    {
      name: "内容",
      items: [
        {
          name: "文章",
          path: "/posts",
          icon: IconBookRead,
        },
      ],
    },
  ],
});
