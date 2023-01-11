<script lang="ts" setup>
import type { CategoryTree } from "@/modules/contents/posts/categories/utils";
import { IconCheckboxCircle } from "@halo-dev/components";
import { inject } from "vue";

withDefaults(
  defineProps<{
    category: CategoryTree;
  }>(),
  {}
);

const isSelected = inject<(category: CategoryTree) => boolean>("isSelected");

const emit = defineEmits<{
  (event: "select", category: CategoryTree): void;
}>();

const onSelect = (childCategory: CategoryTree) => {
  emit("select", childCategory);
};
</script>

<template>
  <li>
    <div
      class="flex cursor-pointer justify-between p-2 hover:bg-gray-100"
      :class="{
        'bg-gray-100 hover:bg-gray-200/60': isSelected?.(category),
        'bg-gray-100': false,
        '!bg-primary/80': false,
      }"
      @click="emit('select', category)"
    >
      <span
        class="text-xs text-gray-700 group-hover:text-gray-900"
        :class="{ 'text-gray-900': isSelected?.(category) }"
      >
        {{ category.spec.displayName }}
      </span>
      <IconCheckboxCircle
        class="text-gray-600 opacity-0"
        :class="{ 'opacity-100': isSelected?.(category) }"
      />
    </div>

    <ul v-if="category.spec.children" class="ml-2.5">
      <CategoryListItem
        v-for="(childCategory, index) in category.spec.children"
        :key="index"
        :category="childCategory"
        @select="onSelect"
      />
    </ul>
  </li>
</template>
