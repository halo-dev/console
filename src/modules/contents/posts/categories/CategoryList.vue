<script lang="ts" setup>
// core libs
import { onMounted, ref } from "vue";
import { apiClient } from "@halo-dev/admin-shared";

// components
import {
  IconAddCircle,
  IconBookRead,
  IconList,
  IconSettings,
  useDialog,
  VButton,
  VCard,
  VPageHeader,
  VSpace,
} from "@halo-dev/components";
import CategoryEditingModal from "./components/CategoryEditingModal.vue";

// types
import type { Category } from "@halo-dev/api-client";

const dialog = useDialog();

const editingModal = ref(false);
const categories = ref<Category[]>([] as Category[]);
const selectedCategory = ref<Category | null>(null);

const handleFetchCategories = async () => {
  selectedCategory.value = null;

  try {
    const { data } =
      await apiClient.extension.category.listcontentHaloRunV1alpha1Category(
        0,
        0
      );
    categories.value = data.items;
  } catch (e) {
    console.error("Failed to fetch categories", e);
  }
};

const handleDelete = async (category: Category) => {
  dialog.warning({
    title: "确定要删除该分类吗？",
    description: "删除此分类之后，对应文章的关联将被解除。该操作不可恢复。",
    confirmType: "danger",
    onConfirm: async () => {
      try {
        await apiClient.extension.category.deletecontentHaloRunV1alpha1Category(
          category.metadata.name
        );
      } catch (e) {
        console.error("Failed to delete tag", e);
      } finally {
        await handleFetchCategories();
      }
    },
  });
};

const handleOpenEditingModal = (category: Category | null) => {
  selectedCategory.value = category;
  editingModal.value = true;
};

onMounted(() => {
  handleFetchCategories();
});
</script>
<template>
  <CategoryEditingModal
    v-model:visible="editingModal"
    :category="selectedCategory"
    @close="handleFetchCategories"
  />
  <VPageHeader title="文章分类">
    <template #icon>
      <IconBookRead class="mr-2 self-center" />
    </template>

    <template #actions>
      <VButton type="secondary" @click="editingModal = true">
        <template #icon>
          <IconAddCircle class="h-full w-full" />
        </template>
        新建
      </VButton>
    </template>
  </VPageHeader>
  <div class="m-0 md:m-4">
    <VCard :body-class="['!p-0']">
      <template #header>
        <div class="block w-full bg-gray-50 px-4 py-3">
          <div
            class="relative flex flex-col items-start sm:flex-row sm:items-center"
          >
            <div class="flex w-full flex-1 sm:w-auto">
              <span class="text-base font-medium">
                {{ categories.length }} 个分类
              </span>
            </div>
          </div>
        </div>
      </template>
      <ul class="box-border h-full w-full divide-y divide-gray-100" role="list">
        <li v-for="(category, index) in categories" :key="index">
          <div
            class="group relative block cursor-pointer px-4 py-3 transition-all hover:bg-gray-50"
          >
            <div
              class="drag-element absolute inset-y-0 left-0 flex hidden w-3.5 cursor-move items-center bg-gray-100 transition-all hover:bg-gray-200 group-hover:flex"
            >
              <IconList class="h-3.5 w-3.5" />
            </div>
            <div class="relative flex flex-row items-center">
              <div class="flex-1">
                <div class="flex flex-col sm:flex-row">
                  <span
                    class="mr-0 truncate text-sm font-medium text-gray-900 sm:mr-2"
                  >
                    {{ category.spec.displayName }}
                  </span>
                  <VSpace class="mt-1 sm:mt-0"></VSpace>
                </div>
                <div class="mt-1 flex">
                  <span class="text-xs text-gray-500">
                    /categories/{{ category.metadata.name }}
                  </span>
                </div>
              </div>
              <div class="flex">
                <div
                  class="inline-flex flex-col flex-col-reverse items-end gap-4 sm:flex-row sm:items-center sm:gap-6"
                >
                  <FloatingTooltip
                    v-if="category.metadata.deletionTimestamp"
                    class="mr-4 hidden items-center sm:flex"
                  >
                    <div
                      class="inline-flex h-1.5 w-1.5 rounded-full bg-red-600"
                    >
                      <span
                        class="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-red-600"
                      ></span>
                    </div>
                    <template #popper> 删除中</template>
                  </FloatingTooltip>
                  <div
                    class="cursor-pointer text-sm text-gray-500 hover:text-gray-900"
                  >
                    20 篇文章
                  </div>
                  <time class="text-sm text-gray-500">
                    {{ category.metadata.creationTimestamp }}
                  </time>
                  <span class="self-center">
                    <FloatingDropdown>
                      <IconSettings
                        class="cursor-pointer transition-all hover:text-blue-600"
                      />
                      <template #popper>
                        <div class="w-48 p-2">
                          <VSpace class="w-full" direction="column">
                            <VButton
                              v-close-popper
                              block
                              type="secondary"
                              @click="handleOpenEditingModal(category)"
                            >
                              修改
                            </VButton>
                            <VButton
                              v-close-popper
                              block
                              type="danger"
                              @click="handleDelete(category)"
                            >
                              删除
                            </VButton>
                          </VSpace>
                        </div>
                      </template>
                    </FloatingDropdown>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </VCard>
  </div>
</template>
