<script lang="ts" setup>
import type { FormKitFrameworkContext } from "@formkit/core";
import type { Category } from "@halo-dev/api-client";
import { computed, provide, ref, watch, type PropType, type Ref } from "vue";
import { IconArrowRight } from "@halo-dev/components";
import { usePostCategory } from "@/modules/contents/posts/categories/composables/use-post-category";
import type { CategoryTree } from "@/modules/contents/posts/categories/utils";
import CategoryListItem from "./components/CategoryListItem.vue";
import { onClickOutside } from "@vueuse/core";
import Fuse from "fuse.js";
import CategoryTag from "./components/CategoryTag.vue";
import SearchResultListItem from "./components/SearchResultListItem.vue";

const props = defineProps({
  context: {
    type: Object as PropType<FormKitFrameworkContext>,
    required: true,
  },
});

const { categories, categoriesTree } = usePostCategory({
  fetchOnMounted: true,
});

provide<Ref<CategoryTree[]>>("categoriesTree", categoriesTree);

const dropdownVisible = ref(false);
const text = ref("");
const wrapperRef = ref<HTMLElement>();

onClickOutside(wrapperRef, () => {
  dropdownVisible.value = false;
});

// search
let fuse: Fuse<Category> | undefined = undefined;

const searchResults = computed(() => {
  if (!fuse || !text.value) {
    return categories.value;
  }
  return fuse?.search(text.value).map((item) => item.item);
});

watch(
  () => categoriesTree.value,
  () => {
    fuse = new Fuse(categories.value, {
      keys: ["spec.displayName", "spec.slug"],
      useExtendedSearch: true,
    });
  }
);

const selectedCategories = computed(() => {
  const currentValue = props.context._value || [];
  return currentValue
    .map((categoryName): Category | undefined => {
      return categories.value.find(
        (category) => category.metadata.name === categoryName
      );
    })
    .filter(Boolean) as Category[];
});

const isSelected = (category: CategoryTree | Category) => {
  return (props.context._value || []).includes(category.metadata.name);
};

provide<(category: CategoryTree | Category) => boolean>(
  "isSelected",
  isSelected
);

const handleSelect = (category: CategoryTree | Category) => {
  const currentValue = props.context._value || [];
  if (currentValue.includes(category.metadata.name)) {
    props.context.node.input(
      currentValue.filter((name: string) => name !== category.metadata.name)
    );
  } else {
    props.context.node.input([...currentValue, category.metadata.name]);
  }
};

// update value immediately during IME composition
// please see https://vuejs.org//guide/essentials/forms.html#text
const onTextInput = (e: Event) => {
  text.value = (e.target as HTMLInputElement).value;
};

// delete last category when text input is empty
const handleDelete = () => {
  if (!text.value) {
    const selectedTagNames = (props.context._value as string[]) || [];
    props.context.node.input(selectedTagNames.slice(0, -1));
  }
};
</script>

<template>
  <div ref="wrapperRef" :class="context.classes['post-categories-wrapper']">
    <div class="formkit-post-categories flex w-full flex-wrap items-center">
      <CategoryTag
        v-for="(category, index) in selectedCategories"
        :key="index"
        :category="category"
        @select="handleSelect"
      />
      <input
        :value="text"
        :class="context.classes.input"
        type="text"
        @input="onTextInput"
        @focus="dropdownVisible = true"
        @keydown.delete="handleDelete"
      />
    </div>

    <div
      :class="context.classes['post-categories-button']"
      @click="dropdownVisible = !dropdownVisible"
    >
      <IconArrowRight class="rotate-90 text-gray-500 hover:text-gray-700" />
    </div>

    <div v-if="dropdownVisible" :class="context.classes['dropdown-wrapper']">
      <ul>
        <li
          class="group flex cursor-pointer items-center justify-between bg-gray-100 p-2"
        >
          <span class="text-xs text-gray-700 group-hover:text-gray-900">
            创建 分类
          </span>
        </li>
        <template v-if="text">
          <SearchResultListItem
            v-for="category in searchResults"
            :key="category.metadata.name"
            :category="category"
            @select="handleSelect"
          />
        </template>
        <template v-else>
          <CategoryListItem
            v-for="category in categoriesTree"
            :key="category.metadata.name"
            :category="category"
            @select="handleSelect"
          />
        </template>
      </ul>
    </div>
  </div>
</template>
