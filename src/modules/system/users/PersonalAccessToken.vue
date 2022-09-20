<script lang="ts" setup>
import {
  IconAddCircle,
  IconStopCircle,
  VButton,
  VSpace,
  VEntity,
  VEntityField,
  VStatusDot,
  useDialog,
} from "@halo-dev/components";
import PersonalAccessTokenEditingModal from "./components/PersonalAccessTokenEditingModal.vue";
import { onMounted, ref } from "vue";
import { apiClient } from "@halo-dev/admin-shared";
import type { PersonalAccessToken } from "@halo-dev/api-client";
import { formatDatetime } from "@/utils/date";
import cloneDeep from "lodash.clonedeep";

const personalAccessTokens = ref<PersonalAccessToken[]>(
  [] as PersonalAccessToken[]
);
const editingModal = ref(false);

const dialog = useDialog();

const handleFetchPersonalAccessTokens = async () => {
  try {
    const { data } =
      await apiClient.extension.personalAccessToken.listsecurityHaloRunV1alpha1PersonalAccessToken();
    personalAccessTokens.value = data.items;
  } catch (e) {
    console.error("Failed to fetch personal access tokens", e);
  }
};

const handleDelete = async (personalAccessToken: PersonalAccessToken) => {
  dialog.warning({
    title: "是否确认删除该 Token？",
    description: "删除后将无法恢复。",
    confirmType: "danger",
    onConfirm: async () => {
      await apiClient.extension.personalAccessToken.deletesecurityHaloRunV1alpha1PersonalAccessToken(
        {
          name: personalAccessToken.metadata.name,
        }
      );
      await handleFetchPersonalAccessTokens();
    },
  });
};

const handleRevoke = async (personalAccessToken: PersonalAccessToken) => {
  dialog.warning({
    title: "是否确认禁用该 Token？",
    description: "禁用之后将无法使用该 Token，请确保没有应用正在使用该 Token。",
    confirmType: "danger",
    onConfirm: async () => {
      await handleToggleRevoked(personalAccessToken, true);
      await handleFetchPersonalAccessTokens();
    },
  });
};

const handleRevert = async (personalAccessToken: PersonalAccessToken) => {
  dialog.warning({
    title: "是否确认启用该 Token？",
    confirmType: "primary",
    onConfirm: async () => {
      await handleToggleRevoked(personalAccessToken, false);
      await handleFetchPersonalAccessTokens();
    },
  });
};

const handleToggleRevoked = async (
  personalAccessToken: PersonalAccessToken,
  revoked: boolean
) => {
  const tokenToUpdate = cloneDeep(personalAccessToken);
  if (!tokenToUpdate.spec) {
    return;
  }
  tokenToUpdate.spec.revoked = revoked;
  await apiClient.extension.personalAccessToken.updatesecurityHaloRunV1alpha1PersonalAccessToken(
    {
      name: tokenToUpdate.metadata.name,
      personalAccessToken: tokenToUpdate,
    }
  );
};

onMounted(() => {
  handleFetchPersonalAccessTokens();
});
</script>
<template>
  <PersonalAccessTokenEditingModal
    v-model:visible="editingModal"
    @close="handleFetchPersonalAccessTokens"
  />

  <div class="mt-5 flex justify-end">
    <VSpace>
      <VButton size="sm" type="danger">
        <template #icon>
          <IconStopCircle class="h-full w-full" />
        </template>
        禁用所有
      </VButton>
      <VButton type="secondary" @click="editingModal = true">
        <template #icon>
          <IconAddCircle class="h-full w-full" />
        </template>
        创建
      </VButton>
    </VSpace>
  </div>

  <ul
    class="mt-5 box-border h-full w-full divide-y divide-gray-100"
    role="list"
  >
    <li v-for="(token, index) in personalAccessTokens" :key="index">
      <VEntity>
        <template #start>
          <VEntityField
            :title="token.spec?.description"
            :description="token.spec?.encodedToken"
          ></VEntityField>
        </template>
        <template #end>
          <VEntityField>
            <template #description>
              <VStatusDot
                :state="token.spec?.revoked ? 'warning' : 'success'"
                :animate="token.spec?.revoked"
              >
                <template #text>
                  <span class="truncate text-xs text-gray-500">
                    {{ token.spec?.revoked ? "已失效" : "有效" }}
                  </span>
                </template>
              </VStatusDot>
            </template>
          </VEntityField>
          <VEntityField v-if="token.metadata.deletionTimestamp">
            <template #description>
              <VStatusDot v-tooltip="`删除中`" state="warning" animate />
            </template>
          </VEntityField>
          <VEntityField>
            <template #description>
              <div class="flex flex-col gap-1">
                <span class="truncate text-xs text-gray-500">
                  创建时间：{{
                    formatDatetime(token.metadata?.creationTimestamp)
                  }}
                </span>
                <span class="truncate text-xs text-gray-500">
                  失效时间：{{
                    token.spec?.expiresAt
                      ? formatDatetime(token.spec.expiresAt)
                      : "永久有效"
                  }}
                </span>
              </div>
            </template>
          </VEntityField>
        </template>
        <template #dropdownItems>
          <VButton
            v-if="!token.spec?.revoked"
            v-close-popper
            block
            type="danger"
            @click="handleRevoke(token)"
          >
            禁用
          </VButton>
          <VButton
            v-else
            v-close-popper
            block
            type="secondary"
            @click="handleRevert(token)"
          >
            启用
          </VButton>
          <VButton
            v-close-popper
            block
            type="danger"
            @click="handleDelete(token)"
          >
            删除
          </VButton>
        </template>
      </VEntity>
    </li>
  </ul>
</template>
