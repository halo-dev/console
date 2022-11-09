<script lang="ts" setup>
import {
  IconBookRead,
  IconCalendar,
  IconCharacterRecognition,
  IconLink,
  IconSave,
  IconUserFollow,
  IconSettings,
  IconSendPlaneFill,
  VButton,
  VPageHeader,
  VSpace,
  VTabItem,
  VTabs,
} from "@halo-dev/components";
import PostSettingModal from "./components/PostSettingModal.vue";
import PostPreviewModal from "./components/PostPreviewModal.vue";
import AttachmentSelectorModal from "../attachments/components/AttachmentSelectorModal.vue";
import type { Post, PostRequest } from "@halo-dev/api-client";
import { computed, markRaw, nextTick, onMounted, ref, watch } from "vue";
import cloneDeep from "lodash.clonedeep";
import { apiClient } from "@/utils/api-client";
import { useRouteQuery } from "@vueuse/router";
import { v4 as uuid } from "uuid";
import {
  allExtensions,
  Extension,
  RichTextEditor,
  useEditor,
} from "@halo-dev/richtext-editor";
import ExtensionCharacterCount from "@tiptap/extension-character-count";
import { formatDatetime } from "@/utils/date";
import { useAttachmentSelect } from "../attachments/composables/use-attachment";
import MdiFileImageBox from "~icons/mdi/file-image-box";
import MdiFormatHeader1 from "~icons/mdi/format-header-1";
import MdiFormatHeader2 from "~icons/mdi/format-header-2";
import MdiFormatHeader3 from "~icons/mdi/format-header-3";
import MdiFormatHeader4 from "~icons/mdi/format-header-4";
import MdiFormatHeader5 from "~icons/mdi/format-header-5";
import MdiFormatHeader6 from "~icons/mdi/format-header-6";
import { useRouter } from "vue-router";

const router = useRouter();

const initialFormState: PostRequest = {
  post: {
    spec: {
      title: "",
      slug: "",
      template: "",
      cover: "",
      deleted: false,
      publish: false,
      publishTime: "",
      pinned: false,
      allowComment: true,
      visible: "PUBLIC",
      version: 1,
      priority: 0,
      excerpt: {
        autoGenerate: true,
        raw: "",
      },
      categories: [],
      tags: [],
      htmlMetas: [],
    },
    apiVersion: "content.halo.run/v1alpha1",
    kind: "Post",
    metadata: {
      name: uuid(),
    },
  },
  content: {
    raw: "",
    content: "",
    rawType: "HTML",
  },
};

const formState = ref<PostRequest>(cloneDeep(initialFormState));
const settingModal = ref(false);
const previewModal = ref(false);
const saving = ref(false);
const publishing = ref(false);
const extraActiveId = ref("toc");
const attachmentSelectorModal = ref(false);

const isUpdateMode = computed(() => {
  return !!formState.value.post.metadata.creationTimestamp;
});

interface HeadingNode {
  id: string;
  level: number;
  text: string;
}

const headingIcons = {
  1: markRaw(MdiFormatHeader1),
  2: markRaw(MdiFormatHeader2),
  3: markRaw(MdiFormatHeader3),
  4: markRaw(MdiFormatHeader4),
  5: markRaw(MdiFormatHeader5),
  6: markRaw(MdiFormatHeader6),
};

const headingNodes = ref<HeadingNode[]>();
const selectedHeadingNode = ref<HeadingNode>();
const editor = useEditor({
  content: formState.value.content.raw,
  extensions: [
    ...allExtensions,
    ExtensionCharacterCount,
    Extension.create({
      addGlobalAttributes() {
        return [
          {
            types: ["heading"],
            attributes: {
              id: {
                default: null,
              },
            },
          },
        ];
      },
    }),
  ],
  autofocus: "start",
  onUpdate: () => {
    formState.value.content.raw = editor.value?.getHTML() + "";
    nextTick(() => {
      handleGenerateTableOfContent();
    });
  },
});

watch(
  () => formState.value.content.raw,
  (newValue) => {
    const isSame = editor.value?.getHTML() === newValue;

    if (isSame) {
      return;
    }

    editor.value?.commands.setContent(newValue as string, false);
  }
);

const { onAttachmentSelect } = useAttachmentSelect(editor);

const handleGenerateTableOfContent = () => {
  if (!editor.value) {
    return;
  }

  const headings: HeadingNode[] = [];
  const transaction = editor.value.state.tr;

  editor.value.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      const id = `heading-${headings.length + 1}`;

      if (node.attrs.id !== id) {
        transaction?.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          id,
        });
      }

      headings.push({
        level: node.attrs.level,
        text: node.textContent,
        id,
      });
    }
  });

  transaction.setMeta("addToHistory", false);
  transaction.setMeta("preventUpdate", true);

  editor.value.view.dispatch(transaction);

  headingNodes.value = headings;

  if (!selectedHeadingNode.value) {
    selectedHeadingNode.value = headings[0];
  }
};

const handleSelectHeadingNode = (node: HeadingNode) => {
  selectedHeadingNode.value = node;
  document.getElementById(node.id)?.scrollIntoView({ behavior: "smooth" });
};

const handleSave = async () => {
  try {
    saving.value = true;

    // Set rendered content
    formState.value.content.content = formState.value.content.raw;

    // Set default title and slug
    if (!formState.value.post.spec.title) {
      formState.value.post.spec.title = "无标题文章";
    }

    if (!formState.value.post.spec.slug) {
      formState.value.post.spec.slug = uuid();
    }

    if (isUpdateMode.value) {
      // Get latest post
      const { data: latestPost } =
        await apiClient.extension.post.getcontentHaloRunV1alpha1Post({
          name: formState.value.post.metadata.name,
        });

      formState.value.post = latestPost;

      const { data } = await apiClient.post.updateDraftPost({
        name: formState.value.post.metadata.name,
        postRequest: formState.value,
      });

      formState.value.post = data;
    } else {
      const { data } = await apiClient.post.draftPost({
        postRequest: formState.value,
      });
      formState.value.post = data;
      name.value = data.metadata.name;
    }

    await handleFetchContent();
  } catch (e) {
    console.error("Failed to save post", e);
  } finally {
    saving.value = false;
  }
};

const handlePublish = async () => {
  try {
    publishing.value = true;

    // Set rendered content
    formState.value.content.content = formState.value.content.raw;

    if (isUpdateMode.value) {
      const { headSnapshot } = formState.value.post.spec;
      const { name: postName } = formState.value.post.metadata;
      const { data: latestContent } =
        await apiClient.content.updateSnapshotContent({
          snapshotName: headSnapshot as string,
          contentRequest: {
            raw: formState.value.content.raw as string,
            content: formState.value.content.content as string,
            rawType: formState.value.content.rawType as string,
            headSnapshotName: headSnapshot,
            subjectRef: {
              kind: "Post",
              version: "v1alpha1",
              group: "content.halo.run",
              name: postName,
            },
          },
        });

      // Get latest post
      const { data: latestPost } =
        await apiClient.extension.post.getcontentHaloRunV1alpha1Post({
          name: postName,
        });

      formState.value.post = latestPost;
      formState.value.post.spec.publish = true;
      formState.value.post.spec.headSnapshot = latestContent.snapshotName;
      formState.value.post.spec.releaseSnapshot =
        formState.value.post.spec.headSnapshot;

      await apiClient.extension.post.updatecontentHaloRunV1alpha1Post({
        name: postName,
        post: formState.value.post,
      });
    } else {
      formState.value.post.spec.publish = true;
      await apiClient.post.draftPost({
        postRequest: formState.value,
      });
    }

    router.push({ name: "Posts" });
  } catch (error) {
    console.error("Failed to publish post", error);
  } finally {
    publishing.value = false;
  }
};

const handlePublishClick = () => {
  if (isUpdateMode.value) {
    handlePublish();
  } else {
    settingModal.value = true;
  }
};

const handleFetchContent = async () => {
  if (!formState.value.post.spec.headSnapshot) {
    return;
  }

  const { data } = await apiClient.content.obtainSnapshotContent({
    snapshotName: formState.value.post.spec.headSnapshot,
  });

  formState.value.content = data;
};

const handleOpenSettingModal = async () => {
  const { data: latestPost } =
    await apiClient.extension.post.getcontentHaloRunV1alpha1Post({
      name: formState.value.post.metadata.name,
    });
  formState.value.post = latestPost;
  settingModal.value = true;
};

const onSettingSaved = (post: Post) => {
  // Set route query parameter
  if (!isUpdateMode.value) {
    name.value = post.metadata.name;
  }

  formState.value.post = post;
  settingModal.value = false;

  if (!isUpdateMode.value) {
    handleSave();
  }
};

const onSettingPublished = (post: Post) => {
  formState.value.post = post;
  settingModal.value = false;
  handlePublish();
};

// Get post data when the route contains the name parameter
const name = useRouteQuery("name");
onMounted(async () => {
  if (name.value) {
    // fetch post
    const { data: post } =
      await apiClient.extension.post.getcontentHaloRunV1alpha1Post({
        name: name.value as string,
      });
    formState.value.post = post;

    // fetch post content
    await handleFetchContent();
    handleGenerateTableOfContent();
  }
});
</script>

<template>
  <PostSettingModal
    v-model:visible="settingModal"
    :post="formState.post"
    :publish-support="!isUpdateMode"
    :only-emit="!isUpdateMode"
    @saved="onSettingSaved"
    @published="onSettingPublished"
  />
  <PostPreviewModal v-model:visible="previewModal" :post="formState.post" />
  <AttachmentSelectorModal
    v-model:visible="attachmentSelectorModal"
    @select="onAttachmentSelect"
  />
  <VPageHeader title="文章">
    <template #icon>
      <IconBookRead class="mr-2 self-center" />
    </template>
    <template #actions>
      <VSpace>
        <!-- TODO: add preview post support -->
        <VButton
          v-if="false"
          size="sm"
          type="default"
          @click="previewModal = true"
        >
          预览
        </VButton>
        <VButton :loading="saving" size="sm" type="default" @click="handleSave">
          <template #icon>
            <IconSave class="h-full w-full" />
          </template>
          保存
        </VButton>
        <VButton
          v-if="isUpdateMode"
          size="sm"
          type="default"
          @click="handleOpenSettingModal"
        >
          <template #icon>
            <IconSettings class="h-full w-full" />
          </template>
          设置
        </VButton>
        <VButton
          type="secondary"
          :loading="publishing"
          @click="handlePublishClick"
        >
          <template #icon>
            <IconSendPlaneFill class="h-full w-full" />
          </template>
          发布
        </VButton>
      </VSpace>
    </template>
  </VPageHeader>
  <div class="editor border-t" style="height: calc(100vh - 3.5rem)">
    <RichTextEditor
      v-if="editor"
      :editor="editor"
      :additional-menu-items="[
        {
          type: 'button',
          icon: MdiFileImageBox,
          title: 'SuperScript',
          action: () => (attachmentSelectorModal = true),
          isActive: () => false,
        },
      ]"
    >
      <template #extra>
        <div class="h-full w-72 overflow-y-auto border-l bg-white">
          <VTabs v-model:active-id="extraActiveId" type="outline">
            <VTabItem id="toc" label="大纲">
              <div class="p-1 pt-0">
                <ul class="space-y-1">
                  <li
                    v-for="(node, index) in headingNodes"
                    :key="index"
                    :class="[
                      { 'bg-gray-100': node.id === selectedHeadingNode?.id },
                    ]"
                    class="group cursor-pointer truncate rounded-base px-1.5 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    @click="handleSelectHeadingNode(node)"
                  >
                    <div
                      :style="{
                        paddingLeft: `${(node.level - 1) * 0.8}rem`,
                      }"
                      class="flex items-center gap-2"
                    >
                      <component
                        :is="headingIcons[node.level]"
                        class="h-4 w-4 rounded-sm bg-gray-100 p-0.5 group-hover:bg-white"
                        :class="[
                          { '!bg-white': node.id === selectedHeadingNode?.id },
                        ]"
                      />
                      <span class="flex-1 truncate">{{ node.text }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </VTabItem>
            <VTabItem id="information" label="详情">
              <div class="flex flex-col gap-2 p-1 pt-0">
                <div class="grid grid-cols-2 gap-2">
                  <div
                    class="group flex cursor-pointer flex-col gap-y-5 rounded-md bg-gray-100 px-1.5 py-1 transition-all"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="text-sm text-gray-500 group-hover:text-gray-900"
                      >
                        字符数
                      </div>
                      <div class="rounded bg-gray-200 p-0.5">
                        <IconCharacterRecognition
                          class="h-4 w-4 text-gray-600 group-hover:text-gray-900"
                        />
                      </div>
                    </div>
                    <div class="text-base font-medium text-gray-900">
                      {{ editor.storage.characterCount.characters() }}
                    </div>
                  </div>
                  <div
                    class="group flex cursor-pointer flex-col gap-y-5 rounded-md bg-gray-100 px-1.5 py-1 transition-all"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="text-sm text-gray-500 group-hover:text-gray-900"
                      >
                        词数
                      </div>
                      <div class="rounded bg-gray-200 p-0.5">
                        <IconCharacterRecognition
                          class="h-4 w-4 text-gray-600 group-hover:text-gray-900"
                        />
                      </div>
                    </div>
                    <div class="text-base font-medium text-gray-900">
                      {{ editor.storage.characterCount.words() }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-2">
                  <div
                    class="group flex cursor-pointer flex-col gap-y-5 rounded-md bg-gray-100 px-1.5 py-1 transition-all"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="text-sm text-gray-500 group-hover:text-gray-900"
                      >
                        发布时间
                      </div>
                      <div class="rounded bg-gray-200 p-0.5">
                        <IconCalendar
                          class="h-4 w-4 text-gray-600 group-hover:text-gray-900"
                        />
                      </div>
                    </div>
                    <div class="text-base font-medium text-gray-900">
                      {{
                        formatDatetime(formState.post.spec.publishTime) ||
                        "未发布"
                      }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-2">
                  <div
                    class="group flex cursor-pointer flex-col gap-y-5 rounded-md bg-gray-100 px-1.5 py-1 transition-all"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="text-sm text-gray-500 group-hover:text-gray-900"
                      >
                        创建者
                      </div>
                      <div class="rounded bg-gray-200 p-0.5">
                        <IconUserFollow
                          class="h-4 w-4 text-gray-600 group-hover:text-gray-900"
                        />
                      </div>
                    </div>
                    <div class="text-base font-medium text-gray-900">
                      {{ formState.post.spec.owner }}
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-2">
                  <div
                    class="group flex cursor-pointer flex-col gap-y-5 rounded-md bg-gray-100 px-1.5 py-1 transition-all"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="text-sm text-gray-500 group-hover:text-gray-900"
                      >
                        访问链接
                      </div>
                      <div class="rounded bg-gray-200 p-0.5">
                        <IconLink
                          class="h-4 w-4 text-gray-600 group-hover:text-gray-900"
                        />
                      </div>
                    </div>
                    <div class="text-sm text-gray-900 hover:text-blue-600">
                      {{ formState.post.status?.["permalink"] }}
                    </div>
                  </div>
                </div>
              </div>
            </VTabItem>
          </VTabs>
        </div>
      </template>
    </RichTextEditor>
  </div>
</template>
