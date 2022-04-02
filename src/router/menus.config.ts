import { IconDashboard } from "@/core/icons";

declare interface MenuGroupType {
  name?: string;
  items: MenuItemType[];
}

declare interface MenuItemType {
  name: string;
  path: string;
  icon?: string;
  meta?: Record<string, unknown>;
  children?: MenuItemType[];
}

export const menus: MenuGroupType[] = [
  {
    items: [
      {
        name: "仪表盘",
        path: "/dashboard",
        icon: IconDashboard,
      },
    ],
  },
  {
    name: "内容",
    items: [
      {
        name: "文章",
        path: "/posts",
        icon: IconDashboard,
        children: [
          {
            name: "分类",
            path: "/categories",
            icon: IconDashboard,
          },
          {
            name: "标签",
            path: "/tags",
            icon: IconDashboard,
          },
        ],
      },
      {
        name: "页面",
        path: "/sheets",
        icon: IconDashboard,
      },
      {
        name: "评论",
        path: "/comment",
        icon: IconDashboard,
      },
      {
        name: "附件",
        path: "/attachment",
        icon: IconDashboard,
      },
    ],
  },
  {
    name: "外观",
    items: [
      {
        name: "主题",
        path: "/themes",
        icon: IconDashboard,
      },
      {
        name: "菜单",
        path: "/menus",
        icon: IconDashboard,
      },
      {
        name: "可视化",
        path: "/visual",
        icon: IconDashboard,
      },
    ],
  },
  {
    name: "系统",
    items: [
      {
        name: "插件",
        path: "/plugins",
        icon: IconDashboard,
      },
      {
        name: "用户",
        path: "/users",
        icon: IconDashboard,
      },
      {
        name: "设置",
        path: "/settings",
        icon: IconDashboard,
      },
    ],
  },
];

export type { MenuItemType, MenuGroupType };

export default menus;
