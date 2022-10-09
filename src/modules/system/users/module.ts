import { BasicLayout, BlankLayout, definePlugin } from "@halo-dev/console-shared";
import UserProfileLayout from "./layouts/UserProfileLayout.vue";
import UserList from "./UserList.vue";
import UserDetail from "./UserDetail.vue";
import PersonalAccessTokens from "./PersonalAccessTokens.vue";
import Login from "./Login.vue";
import { IconUserSettings } from "@halo-dev/components";

export default definePlugin({
  name: "userModule",
  components: [],
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/users",
      component: BlankLayout,
      children: [
        {
          path: "",
          component: BasicLayout,
          children: [
            {
              path: "",
              name: "Users",
              component: UserList,
              meta: {
                title: "用户",
                searchable: true,
                permissions: ["system:users:view"],
              },
            },
          ],
        },
        {
          path: ":name",
          component: UserProfileLayout,
          name: "User",
          children: [
            {
              path: "detail",
              name: "UserDetail",
              component: UserDetail,
              meta: {
                title: "用户详情",
              },
            },
            {
              path: "tokens",
              name: "PersonalAccessTokens",
              component: PersonalAccessTokens,
              meta: {
                title: "个人令牌",
              },
            },
          ],
        },
      ],
    },
  ],
  menus: [
    {
      name: "系统",
      items: [
        {
          name: "用户",
          path: "/users",
          icon: IconUserSettings,
        },
      ],
    },
  ],
});
