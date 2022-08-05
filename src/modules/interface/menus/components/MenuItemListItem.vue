<script lang="ts" setup>
import { IconList, IconSettings, VSpace } from "@halo-dev/components";
import Draggable from "vuedraggable";
import type { PropType } from "vue";
import { ref } from "vue";
import type { MenuTreeItem } from "@/modules/interface/menus/utils";

defineProps({
  menuTreeItems: {
    type: Array as PropType<MenuTreeItem[]>,
    default: () => [],
  },
});

const emit = defineEmits(["change"]);

const isDragging = ref(false);

function onChange() {
  emit("change");
}
</script>
<template>
  <draggable
    :list="menuTreeItems"
    class="box-border h-full w-full divide-y divide-gray-100"
    group="menu-item"
    item-key="metadata.name"
    tag="ul"
    @change="onChange"
    @end="isDragging = false"
    @start="isDragging = true"
  >
    <template #item="{ element: menuItem }">
      <li>
        <div
          class="relative block cursor-pointer px-4 py-3 transition-all hover:bg-gray-50"
        >
          <div class="relative flex flex-row items-center">
            <div class="flex-1">
              <div class="flex flex-row items-center">
                <div class="drag-element mr-2 cursor-move">
                  <IconList class="h-4 w-4" />
                </div>
                <span class="truncate text-sm font-medium text-gray-900">
                  {{ menuItem.spec.displayName }}
                </span>
              </div>

              <div class="mt-1 flex">
                <VSpace align="start" direction="column" spacing="xs">
                  <a
                    :href="menuItem.spec.href"
                    class="text-xs text-gray-500 hover:text-gray-900"
                    target="_blank"
                  >
                    {{ menuItem.spec.href }}
                  </a>
                </VSpace>
              </div>
            </div>
            <div class="flex">
              <div
                class="inline-flex flex-col flex-col-reverse items-end gap-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <IconSettings
                  class="cursor-pointer transition-all hover:text-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        <MenuItemListItem
          :class="{ 'my-2 min-h-[40px] rounded-base bg-gray-100': isDragging }"
          :menu-tree-items="menuItem.spec.children"
          class="ml-10 transition-all duration-300"
          @change="onChange"
        />
      </li>
    </template>
  </draggable>
</template>
