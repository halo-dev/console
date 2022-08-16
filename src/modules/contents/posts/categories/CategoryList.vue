<script lang="ts" setup>
// core libs
import { onMounted, ref } from "vue";
import { apiClient } from "@halo-dev/admin-shared";

// components
import {
  IconAddCircle,
  IconBookRead,
  useDialog,
  VButton,
  VCard,
  VPageHeader,
} from "@halo-dev/components";
import CategoryEditingModal from "./components/CategoryEditingModal.vue";
import CategoryListItem from "./components/CategoryListItem.vue";

// types
import type { Category } from "@halo-dev/api-client";
import type { CategoryTree } from "./utils";
import {
  buildCategoriesTree,
  convertCategoryTreeToCategory,
  convertTreeToCategories,
  resetCategoriesTreePriority,
} from "./utils";
import { useDebounceFn } from "@vueuse/core";

const dialog = useDialog();

const editingModal = ref(false);
const categories = ref<Category[]>([] as Category[]);
const categoriesTree = ref<CategoryTree[]>([] as CategoryTree[]);
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
    categoriesTree.value = buildCategoriesTree(data.items);
  } catch (e) {
    console.error("Failed to fetch categories", e);
  }
};

const handleUpdateInBatch = useDebounceFn(async () => {
  const categoriesTreeToUpdate = resetCategoriesTreePriority(
    categoriesTree.value
  );
  const categoriesToUpdate = convertTreeToCategories(categoriesTreeToUpdate);
  try {
    const promises = categoriesToUpdate.map((category) =>
      apiClient.extension.category.updatecontentHaloRunV1alpha1Category(
        category.metadata.name,
        category
      )
    );
    await Promise.all(promises);
  } catch (e) {
    console.log("Failed to update categories", e);
  } finally {
    await handleFetchCategories();
  }
}, 500);

const handleDelete = async (category: CategoryTree) => {
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

const handleOpenEditingModal = (category: CategoryTree) => {
  selectedCategory.value = convertCategoryTreeToCategory(category);
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
      <CategoryListItem
        :categories="categoriesTree"
        @change="handleUpdateInBatch"
        @delete="handleDelete"
        @open-editing="handleOpenEditingModal"
      />
    </VCard>
  </div>
</template>
