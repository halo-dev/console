<script lang="ts" setup>
import { VCard, IconCheckboxFill } from "@halo-dev/components";
import { ref, onMounted, watchEffect } from "vue";
import { createApi } from "unsplash-js";
import type { Basic } from "unsplash-js/dist/methods/photos/types";
import type { AttachmentLike } from "./types";

withDefaults(
  defineProps<{
    selected: AttachmentLike[];
  }>(),
  {
    selected: () => [],
  }
);

const emit = defineEmits<{
  (event: "update:selected", attachments: AttachmentLike[]): void;
}>();

// TODO: Remove test access key
const unsplash = createApi({
  accessKey: "ScctpE3uOptjrbbglKenZ1R22-KafOieAA00gZK-j3U",
});

const unsplashPhotos = ref<Basic[]>();

const selectedPhotos = ref<Set<Basic>>(new Set());

const handleFetchUnsplash = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "halo",
    perPage: 50,
  });
  unsplashPhotos.value = photos.response?.results;
  console.log(photos);
};

const handleSelect = async (photo: Basic) => {
  if (selectedPhotos.value.has(photo)) {
    selectedPhotos.value.delete(photo);
    return;
  }
  selectedPhotos.value.add(photo);
};

const isChecked = (photo: Basic) => {
  return Array.from(selectedPhotos.value)
    .map((item) => item.id)
    .includes(photo.id);
};

watchEffect(() => {
  const photos = Array.from(selectedPhotos.value).map((photo) => {
    return {
      url: photo.urls.raw,
      type: photo.alt_description as string,
    };
  });
  emit("update:selected", photos);
});

onMounted(() => {
  handleFetchUnsplash();
});
</script>
<template>
  <div
    class="mt-2 grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
    role="list"
  >
    <VCard
      v-for="(photo, index) in unsplashPhotos"
      :key="index"
      :body-class="['!p-0']"
      :class="{
        'ring-1 ring-primary': isChecked(photo),
      }"
      class="hover:shadow"
      @click.stop="handleSelect(photo)"
    >
      <div class="group relative bg-white">
        <div
          class="aspect-w-10 aspect-h-8 block h-full w-full cursor-pointer overflow-hidden bg-gray-100"
        >
          <img
            class="pointer-events-none object-cover group-hover:opacity-75"
            :src="photo.urls.thumb"
          />
        </div>
        <p
          class="pointer-events-none block truncate px-2 py-1 text-center text-xs font-medium text-gray-700"
        >
          {{ photo.alt_description }}
        </p>
        <div
          :class="{ '!flex': selectedPhotos.has(photo) }"
          class="absolute top-0 left-0 hidden h-1/3 w-full justify-end bg-gradient-to-b from-gray-300 to-transparent ease-in-out group-hover:flex"
        >
          <IconCheckboxFill
            :class="{
              '!text-primary': selectedPhotos.has(photo),
            }"
            class="mt-1 mr-1 h-6 w-6 cursor-pointer text-white transition-all hover:text-primary"
          />
        </div>
      </div>
    </VCard>
  </div>
</template>
