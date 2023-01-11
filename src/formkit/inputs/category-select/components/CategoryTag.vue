<script lang="ts" setup>
import type { CategoryTree } from "@/modules/contents/posts/categories/utils";
import { getCategoryPath } from "@/modules/contents/posts/categories/utils";
import type { Category } from "@halo-dev/api-client";
import { computed, inject, ref, type Ref } from "vue";
import { IconClose } from "@halo-dev/components";

const props = withDefaults(
  defineProps<{
    category: Category;
  }>(),
  {}
);

const emit = defineEmits<{
  (event: "select", category: CategoryTree | Category): void;
}>();

const categoriesTree = inject<Ref<CategoryTree[]>>("categoriesTree", ref([]));

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
  <div class="inline-flex items-center p-1">
    <div
      class="inline-flex items-center gap-1 rounded-full bg-primary py-1 px-2 text-white"
    >
      <span class="text-xs">
        {{ label }}
      </span>
      <IconClose
        class="h-4 w-4 cursor-pointer text-white hover:text-slate-200"
        @click="emit('select', category)"
      />
    </div>
  </div>
</template>
