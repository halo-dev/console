<script lang="ts" setup>
import {
  getCategoryPath,
  type CategoryTree,
} from "@/modules/contents/posts/categories/utils";
import type { Category } from "@halo-dev/api-client";
import { IconCheckboxCircle } from "@halo-dev/components";
import { computed, inject, ref, type Ref } from "vue";

const props = withDefaults(
  defineProps<{
    category: Category;
  }>(),
  {}
);

const categoriesTree = inject<Ref<CategoryTree[]>>("categoriesTree", ref([]));

const isSelected =
  inject<(category: Category | CategoryTree) => boolean>("isSelected");

const emit = defineEmits<{
  (event: "select", category: CategoryTree | Category): void;
}>();

const label = computed(() => {
  const categories = getCategoryPath(
    categoriesTree.value,
    props.category.metadata.name
  );
  return categories
    .map((category: CategoryTree) => category.spec.displayName)
    .join(" / ");
});
</script>

<template>
  <li>
    <div
      class="flex cursor-pointer justify-between p-2 hover:bg-gray-100"
      :class="{
        'bg-primary hover:bg-primary/80': isSelected?.(category),
        'bg-gray-100': false,
        '!bg-primary/80': false,
      }"
      @click="emit('select', category)"
    >
      <span
        class="text-xs text-gray-700 group-hover:text-gray-900"
        :class="{ 'text-white group-hover:text-white': isSelected?.(category) }"
      >
        {{ label }}
      </span>
      <IconCheckboxCircle
        class="text-white opacity-0"
        :class="{ 'opacity-100': isSelected?.(category) }"
      />
    </div>
  </li>
</template>
