<script lang="ts" setup>
import {
  VButton,
  IconAddCircle,
  IconCloseCircle,
  IconArrowUpCircleLine,
  IconArrowDownCircleLine,
} from "@halo-dev/components";
import type { FormKitFrameworkContext } from "@formkit/core";
import type { PropType } from "vue";
import cloneDeep from "lodash.clonedeep";

const props = defineProps({
  context: {
    type: Object as PropType<FormKitFrameworkContext>,
    required: true,
  },
});

const handleAppend = async () => {
  await props.context.node.input([...props.context._value, {}]);
};

const handleRemove = async (index: number) => {
  const value = cloneDeep(props.context._value);
  value.splice(index, 1);
  await props.context.node.input(value);
};

const handleMoveUp = (index: number) => {
  if (index === 0) {
    return;
  }

  const value = cloneDeep(props.context._value);
  value.splice(index - 1, 0, value.splice(index, 1)[0]);
  props.context.node.input(value);
};

const handleMoveDown = (index: number) => {
  if (index === props.context._value.length - 1) {
    return;
  }

  const value = cloneDeep(props.context._value);
  value.splice(index + 1, 0, value.splice(index, 1)[0]);
  props.context.node.input(value);
};
</script>

<template>
  <ul :class="context.classes.items">
    <li
      v-for="(item, index) in context._value"
      :key="index"
      :class="context.classes.item"
    >
      <div :class="context.classes.content">
        <FormKit type="group">
          <slot />
        </FormKit>
      </div>
      <div :class="context.classes.controls">
        <ul class="flex flex-col items-center justify-center gap-4">
          <li
            class="cursor-pointer text-gray-500 transition-all hover:text-primary"
            :class="{
              'cursor-not-allowed opacity-50 hover:!text-gray-500': index === 0,
            }"
          >
            <IconArrowUpCircleLine
              class="h-6 w-6"
              @click="handleMoveUp(index)"
            />
          </li>
          <li
            class="cursor-pointer text-gray-500 transition-all hover:text-primary"
          >
            <IconCloseCircle class="h-6 w-6" @click="handleRemove(index)" />
          </li>
          <li
            class="cursor-pointer text-gray-500 transition-all hover:text-primary"
            :class="{
              'cursor-not-allowed opacity-50 hover:!text-gray-500':
                index === context._value.length - 1,
            }"
          >
            <IconArrowDownCircleLine
              class="h-6 w-6"
              @click="handleMoveDown(index)"
            />
          </li>
        </ul>
      </div>
    </li>
  </ul>
  <div :class="context.classes.add">
    <VButton type="secondary" @click="handleAppend">
      <template #icon>
        <IconAddCircle class="h-full w-full" />
      </template>
      添加
    </VButton>
  </div>
</template>
