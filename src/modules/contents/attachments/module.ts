import { definePlugin } from "@halo-dev/console-shared";
import BasicLayout from "@/layouts/BasicLayout.vue";
import AttachmentList from "./AttachmentList.vue";
import AttachmentSelectorModal from "./components/AttachmentSelectorModal.vue";
import { IconFolder } from "@halo-dev/components";

export default definePlugin({
  name: "attachmentModule",
  components: [AttachmentSelectorModal],
  routes: [
    {
      path: "/attachments",
      component: BasicLayout,
      children: [
        {
          path: "",
          name: "Attachments",
          component: AttachmentList,
          meta: {
            title: "附件",
            permissions: ["system:attachments:view"],
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
          name: "附件",
          path: "/attachments",
          icon: IconFolder,
        },
      ],
    },
  ],
});
