<script lang="ts" setup>
import {
  IconArrowRight,
  IconGitBranch,
  IconShieldUser,
  VButton,
  VCard,
  VPageHeader,
  VTabbar,
  VTag,
} from "@halo-dev/components";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { apiClient } from "@halo-dev/admin-shared";
import type { Role, User } from "@halo-dev/api-client";
import { pluginLabels, roleLabels } from "@/constants/labels";
import { rbacAnnotations } from "@/constants/annotations";

interface RoleTemplateGroup {
  module: string | null | undefined;
  roles: Role[];
}

interface FormState {
  role: Role;
  selectedRoleTemplates: string[];
  saving: boolean;
}

const route = useRoute();

const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const roleActiveId = ref("detail");
const formState = ref<FormState>({
  role: {
    apiVersion: "v1alpha1",
    kind: "Role",
    metadata: {
      name: "",
      labels: {},
      annotations: {
        [rbacAnnotations.DEPENDENCIES]: "",
        [rbacAnnotations.DISPLAY_NAME]: "",
      },
    },
    rules: [],
  },
  selectedRoleTemplates: [],
  saving: false,
});

const roleTemplates = computed<Role[]>(() => {
  return roles.value.filter(
    (role) =>
      role.metadata.labels?.[roleLabels.TEMPLATE] === "true" &&
      role.metadata.labels?.["halo.run/hidden"] !== "true"
  );
});

const roleTemplateGroups = computed<RoleTemplateGroup[]>(() => {
  const groups: RoleTemplateGroup[] = [];
  roleTemplates.value.forEach((role) => {
    const group = groups.find(
      (group) =>
        group.module === role.metadata.annotations?.[rbacAnnotations.MODULE]
    );
    if (group) {
      group.roles.push(role);
    } else {
      groups.push({
        module: role.metadata.annotations?.[rbacAnnotations.MODULE],
        roles: [role],
      });
    }
  });
  return groups;
});

const handleFetchRole = async () => {
  try {
    const response = await apiClient.extension.role.getv1alpha1Role(
      route.params.name as string
    );
    formState.value.role = response.data;
    formState.value.selectedRoleTemplates = JSON.parse(
      response.data.metadata.annotations?.[rbacAnnotations.DEPENDENCIES] || "[]"
    );
  } catch (error) {
    console.error(error);
  }
};

const handleFetchRoles = async () => {
  try {
    const { data } = await apiClient.extension.role.listv1alpha1Role();
    roles.value = data.items;
  } catch (e) {
    console.error(e);
  }
};

const handleFetchUsers = async () => {
  try {
    const { data } = await apiClient.extension.user.listv1alpha1User();
    users.value = data.items;
  } catch (e) {
    console.error(e);
  }
};

const handleUpdateRole = async () => {
  try {
    formState.value.saving = true;
    if (formState.value.role.metadata.annotations) {
      formState.value.role.metadata.annotations[rbacAnnotations.DEPENDENCIES] =
        JSON.stringify(formState.value.selectedRoleTemplates);
    }
    await apiClient.extension.role.updatev1alpha1Role(
      route.params.name as string,
      formState.value.role
    );
  } catch (e) {
    console.error(e);
  } finally {
    formState.value.saving = false;
    await handleFetchRole();
  }
};

const router = useRouter();

const handleRouteToUser = (name: string) => {
  router.push({ name: "UserDetail", params: { name } });
};

onMounted(() => {
  handleFetchRole();
  handleFetchRoles();
  handleFetchUsers();
});
</script>
<template>
  <VPageHeader
    :title="`角色：${
      formState.role?.metadata?.annotations?.[rbacAnnotations.DISPLAY_NAME] ||
      formState.role?.metadata?.name
    }`"
  >
    <template #icon>
      <IconShieldUser class="mr-2 self-center" />
    </template>
    <template #actions>
      <VButton v-permission="['system:roles:manage']" type="secondary">
        <template #icon>
          <IconGitBranch class="h-full w-full" />
        </template>
        Fork
      </VButton>
    </template>
  </VPageHeader>
  <div class="m-0 md:m-4">
    <VCard :body-class="['!p-0']">
      <template #header>
        <VTabbar
          v-model:active-id="roleActiveId"
          :items="[
            { id: 'detail', label: '详情' },
            { id: 'permissions', label: '权限设置' },
          ]"
          class="w-full !rounded-none"
          type="outline"
        ></VTabbar>
      </template>
      <div v-if="roleActiveId === 'detail'">
        <div class="px-4 py-4 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">权限信息</h3>
          <p
            class="mt-1 flex max-w-2xl items-center gap-2 text-sm text-gray-500"
          >
            <span>包含 {{ formState.role?.rules?.length }} 个权限</span>
          </p>
        </div>
        <div class="border-t border-gray-200">
          <dl class="divide-y divide-gray-100">
            <div
              class="bg-white px-4 py-5 hover:bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-900">名称</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {{
                  formState.role?.metadata?.annotations?.[
                    rbacAnnotations.DISPLAY_NAME
                  ] || formState.role?.metadata?.name
                }}
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 hover:bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-900">别名</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {{ formState.role?.metadata?.name }}
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 hover:bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-900">类型</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <VTag>系统保留</VTag>
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 hover:bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-900">描述</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                超级管理员
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 hover:bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-900">创建时间</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {{ formState.role?.metadata?.creationTimestamp }}
              </dd>
            </div>
            <div
              class="bg-gray-50 px-4 py-5 hover:bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-900">用户</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <div
                  class="h-96 overflow-y-auto overflow-x-hidden rounded-sm bg-white shadow-sm transition-all hover:shadow"
                >
                  <ul class="divide-y divide-gray-100" role="list">
                    <li
                      v-for="(user, index) in users"
                      :key="index"
                      class="block cursor-pointer hover:bg-gray-50"
                      @click="handleRouteToUser(user.metadata.name)"
                    >
                      <div class="flex items-center px-4 py-4">
                        <div class="flex min-w-0 flex-1 items-center">
                          <div class="flex-shrink-0">
                            <div class="h-12 w-12">
                              <div
                                class="overflow-hidden rounded border bg-white hover:shadow-sm"
                              >
                                <img
                                  :alt="user.spec.displayName"
                                  :src="user.spec.avatar"
                                  class="h-full w-full"
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4"
                          >
                            <div>
                              <p
                                class="truncate text-sm font-medium text-gray-900"
                              >
                                {{ user.spec.displayName }}
                              </p>
                              <p class="mt-2 flex items-center">
                                <span class="text-xs text-gray-500">
                                  {{ user.metadata.name }}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <IconArrowRight />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-if="roleActiveId === 'permissions'">
        <div>
          <dl class="divide-y divide-gray-100">
            <div
              v-for="(group, groupIndex) in roleTemplateGroups"
              :key="groupIndex"
              class="bg-white px-4 py-5 hover:bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-900">
                <div>
                  {{ group.module }}
                </div>
                <div
                  v-if="
                    group.roles.length &&
                    group.roles[0].metadata.labels?.[pluginLabels.NAME]
                  "
                  class="mt-3 text-xs text-gray-500"
                >
                  由
                  <RouterLink
                    :to="{
                      name: 'PluginDetail',
                      params: {
                        name: group.roles[0].metadata.labels?.[
                          pluginLabels.NAME
                        ],
                      },
                    }"
                    class="hover:text-blue-600"
                  >
                    {{ group.roles[0].metadata.labels?.[pluginLabels.NAME] }}
                  </RouterLink>
                  插件提供
                </div>
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul class="space-y-2">
                  <li v-for="(role, index) in group.roles" :key="index">
                    <label
                      class="inline-flex w-72 cursor-pointer flex-row items-center gap-4 rounded border p-5 hover:border-primary"
                    >
                      <input
                        v-model="formState.selectedRoleTemplates"
                        :value="role.metadata.name"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600"
                        type="checkbox"
                      />
                      <div class="flex flex-1 flex-col gap-y-3">
                        <span class="font-medium text-gray-900">
                          {{
                            role.metadata.annotations?.[
                              rbacAnnotations.DISPLAY_NAME
                            ]
                          }}
                        </span>
                        <span
                          v-if="
                            role.metadata.annotations?.[
                              rbacAnnotations.DEPENDENCIES
                            ]
                          "
                          class="text-xs text-gray-400"
                        >
                          依赖于
                          {{
                            JSON.parse(
                              role.metadata.annotations?.[
                                rbacAnnotations.DEPENDENCIES
                              ]
                            ).join(", ")
                          }}
                        </span>
                      </div>
                    </label>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
          <div v-permission="['system:roles:manage']" class="p-4">
            <VButton
              :loading="formState.saving"
              type="secondary"
              @click="handleUpdateRole"
              >保存
            </VButton>
          </div>
        </div>
      </div>
    </VCard>
  </div>
</template>