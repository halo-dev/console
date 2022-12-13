<script lang="ts" setup>
import {
  reset,
  type FormKitNode,
  type FormKitSchemaCondition,
  type FormKitSchemaNode,
} from "@formkit/core";
import { onMounted, ref, watch } from "vue";

const protectedKeys = ["content.halo.run/last-released-snapshot"];

function keyValidationRule(node: FormKitNode) {
  return !props.annotations?.[node.value as string];
}

const props = withDefaults(
  defineProps<{
    annotations?: {
      [key: string]: string;
    } | null;
  }>(),
  {
    annotations: null,
  }
);

const emit = defineEmits<{
  (
    e: "update:annotations",
    annotations: {
      [key: string]: string;
    } | null
  ): void;
}>();

// TODO 需要通过接口获取
const themeAnnotationsFormSchema = ref<
  (FormKitSchemaCondition | FormKitSchemaNode)[]
>([
  {
    $formkit: "text",
    name: "download_url",
    label: "下载链接",
  },
  {
    $formkit: "select",
    name: "version",
    label: "支持的版本",
    options: [
      {
        value: "1.5",
        label: "1.5",
      },
      {
        value: "2.0",
        label: "2.0",
      },
    ],
  },
  {
    $formkit: "radio",
    name: "auto",
    label: "是否自动",
    options: [
      {
        value: "true",
        label: "是",
      },
      {
        value: "false",
        label: "否",
      },
    ],
  },
  {
    $formkit: "number",
    name: "order",
    label: "排序",
  },
]);

const userCustomAnnotations = ref<{ key: string; value: string }[]>([]);

const handleProcessUserCustomAnnotations = () => {
  userCustomAnnotations.value = Object.entries(props.annotations || {})
    .map(([key, value]) => {
      const fromThemeSpec = themeAnnotationsFormSchema.value.some((item) => {
        if (typeof item === "object" && "$formkit" in item) {
          return item.name === key;
        }
        return false;
      });
      const isProtected = protectedKeys.includes(key);
      if (!fromThemeSpec && !isProtected) {
        return {
          key,
          value,
        };
      }
    })
    .filter((item) => item) as { key: string; value: string }[];
};

onMounted(() => {
  if (!props.annotations) {
    emit("update:annotations", {});
  }
  handleProcessUserCustomAnnotations();
});

watch(
  () => props.annotations,
  (value) => {
    reset("specForm");
    reset("userCustomForm");
    if (value) {
      handleProcessUserCustomAnnotations();
    } else {
      emit("update:annotations", {});
    }
  }
);
</script>

<template>
  <div class="flex flex-col gap-3">
    <FormKit
      v-if="annotations"
      id="specForm"
      type="form"
      :model-value="annotations"
    >
      <FormKitSchema :schema="themeAnnotationsFormSchema" />
    </FormKit>
    <FormKit v-if="annotations" id="userCustomForm" type="form">
      <FormKit v-model="userCustomAnnotations" type="repeater" label="自定义">
        <FormKit
          type="text"
          label="Key"
          name="key"
          validation="required|keyValidationRule"
          :validation-rules="{ keyValidationRule }"
          :validation-messages="{
            keyValidationRule: '当前 Key 已被占用',
          }"
        ></FormKit>
        <FormKit
          type="text"
          label="Value"
          name="value"
          validation="required"
        ></FormKit>
      </FormKit>
    </FormKit>
  </div>
</template>
