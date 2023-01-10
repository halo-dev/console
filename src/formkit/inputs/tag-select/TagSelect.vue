<script lang="ts" setup>
import { apiClient } from "@/utils/api-client";
import type { FormKitFrameworkContext } from "@formkit/core";
import type { Tag } from "@halo-dev/api-client";
import { computed, onMounted, ref, type PropType } from "vue";
import {
  IconCheckboxCircle,
  IconArrowRight,
  IconClose,
} from "@halo-dev/components";

const props = defineProps({
  context: {
    type: Object as PropType<FormKitFrameworkContext>,
    required: true,
  },
});

const postTags = ref<Tag[]>([] as Tag[]);
const dropdownVisible = ref(false);

const handleFetchTags = async () => {
  const { data } = await apiClient.extension.tag.listcontentHaloRunV1alpha1Tag({
    page: 0,
    size: 0,
  });

  postTags.value = data.items;
};

// get selected tags by props.context._value
const selectedTags = computed(() => {
  const selectedTagNames = (props.context._value as string[]) || [];
  return postTags.value.filter((tag) =>
    selectedTagNames.includes(tag.metadata.name)
  );
});

const handleSelect = (tag: Tag) => {
  const currentValue = props.context._value || [];
  if (currentValue.includes(tag.metadata.name)) {
    props.context.node.input(
      currentValue.filter((t) => t !== tag.metadata.name)
    );
  } else {
    props.context.node.input([...currentValue, tag.metadata.name]);
  }
};

onMounted(handleFetchTags);
</script>

<template>
  <div class="formkit-post-tags flex w-full flex-wrap items-center">
    <div v-for="(tag, index) in selectedTags" :key="index" class="p-1">
      <div
        class="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5"
      >
        <span class="text-xs">
          {{ tag.spec.displayName }}
        </span>
        <IconClose
          class="h-4 w-4 cursor-pointer text-gray-600 hover:rounded-full hover:bg-white"
          @click="handleSelect(tag)"
        />
      </div>
    </div>
    <input
      class="formkit-input block h-full flex-grow resize-none appearance-none bg-white px-3 text-sm text-black antialiased outline-0 transition-all"
      type="text"
      name="title"
    />
  </div>

  <div
    class="inline-flex h-full cursor-pointer items-center px-1"
    @click="dropdownVisible = !dropdownVisible"
  >
    <IconArrowRight class="rotate-90" />
  </div>
  <div
    v-show="dropdownVisible"
    class="absolute top-full bottom-auto right-0 z-10 mt-1 max-h-96 w-full overflow-auto rounded bg-white drop-shadow-lg"
  >
    <ul class="left-0 overflow-hidden">
      <li
        v-for="tag in postTags"
        :key="tag.metadata.name"
        class="group flex cursor-pointer items-center justify-between py-2 px-2 hover:bg-gray-100"
        :class="{
          'bg-primary hover:bg-primary': props.context._value.includes(
            tag.metadata.name
          ),
        }"
        @click="handleSelect(tag)"
      >
        <span
          class="text-sm text-gray-700 group-hover:text-gray-900"
          :class="{
            'text-white group-hover:text-white': context._value.includes(
              tag.metadata.name
            ),
          }"
        >
          {{ tag.spec.displayName }}
        </span>
        <IconCheckboxCircle
          v-if="context._value.includes(tag.metadata.name)"
          class="text-white"
        />
      </li>
    </ul>
  </div>
</template>
