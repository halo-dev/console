<script lang="ts" setup>
import {
  IconListSettings,
  VButton,
  VCard,
  VPageHeader,
  VSpace,
} from "@halo-dev/components";
import MenuItemEditingModal from "./components/MenuItemEditingModal.vue";
import MenuItemListItem from "./components/MenuItemListItem.vue";
import MenuList from "./components/MenuList.vue";
import { ref } from "vue";
import { apiClient } from "@halo-dev/admin-shared";
import type { Menu, MenuItem } from "@halo-dev/api-client";
import cloneDeep from "lodash.clonedeep";
import type { MenuTreeItem } from "./utils";
import { buildMenuItemsTree, convertTreeToMenuItems } from "./utils";
import { useDebounceFn } from "@vueuse/core";

const menuItems = ref<MenuItem[]>([] as MenuItem[]);
const menuTreeItems = ref<MenuTreeItem[]>([] as MenuTreeItem[]);
const selectedMenu = ref<Menu | undefined>();
const selectedMenuItem = ref<MenuItem | null>(null);
const menuListRef = ref();
const menuItemEditingModal = ref();

const handleFetchMenuItems = async () => {
  try {
    if (!selectedMenu.value?.spec.menuItems) {
      return;
    }
    const menuItemNames = Array.from(selectedMenu.value.spec.menuItems)?.map(
      (item) => item
    );
    const { data } = await apiClient.extension.menuItem.listv1alpha1MenuItem(
      0,
      0,
      undefined,
      [`name=(${menuItemNames.join(",")})`]
    );
    menuItems.value = data.items;

    // Build the menu tree
    menuTreeItems.value = buildMenuItemsTree(data.items);
  } catch (e) {
    console.error("Failed to fetch menu items", e);
  }
};

const handleOpenEditingModal = (menuItem: MenuItem | null) => {
  selectedMenuItem.value = menuItem;
  menuItemEditingModal.value = true;
};

const onMenuSelected = () => {
  handleFetchMenuItems();
};

const onMenuItemSaved = async (menuItem: MenuItem) => {
  const menuToUpdate = cloneDeep(selectedMenu.value);

  if (menuToUpdate) {
    const menuItemsToUpdate = Array.from(
      cloneDeep(menuToUpdate.spec.menuItems) || new Set<string>()
    );
    menuItemsToUpdate.push(menuItem.metadata.name);

    // @ts-ignore
    menuToUpdate.spec.menuItems = Array.from(new Set(menuItemsToUpdate));
    await apiClient.extension.menu.updatev1alpha1Menu(
      menuToUpdate.metadata.name,
      menuToUpdate
    );
  }

  await menuListRef.value.handleFetchMenus();
  await handleFetchMenuItems();
};

const handleUpdateInBatch = useDebounceFn(async () => {
  const menuItemsToUpdate = convertTreeToMenuItems(menuTreeItems.value);
  console.log(menuItemsToUpdate);
  try {
    const promises = menuItemsToUpdate.map((menuItem) =>
      apiClient.extension.menuItem.updatev1alpha1MenuItem(
        menuItem.metadata.name,
        menuItem
      )
    );
    await Promise.all(promises);
  } catch (e) {
    console.log("Failed to update menu items", e);
  } finally {
    await handleFetchMenuItems();
  }
}, 500);
</script>
<template>
  <MenuItemEditingModal
    v-model:visible="menuItemEditingModal"
    :menu-item="selectedMenuItem"
    @saved="onMenuItemSaved"
  />
  <VPageHeader title="菜单">
    <template #icon>
      <IconListSettings class="mr-2 self-center" />
    </template>
    <template #actions>
      <VButton type="secondary">重建索引</VButton>
    </template>
  </VPageHeader>
  <div class="m-0 md:m-4">
    <div class="flex flex-col gap-4 sm:flex-row">
      <div class="w-96">
        <MenuList
          ref="menuListRef"
          v-model:selected-menu="selectedMenu"
          @select="onMenuSelected"
        />
      </div>
      <div class="flex-1">
        <VCard :body-class="['!p-0']">
          <template #header>
            <div class="block w-full bg-gray-50 px-4 py-3">
              <div
                class="relative flex flex-col items-start sm:flex-row sm:items-center"
              >
                <div class="flex w-full flex-1 sm:w-auto">
                  <span class="text-base font-medium">
                    {{ menuListRef?.selectedMenu?.spec.displayName }}
                  </span>
                </div>
                <div class="mt-4 flex sm:mt-0">
                  <VSpace>
                    <VButton
                      size="xs"
                      type="default"
                      @click="menuItemEditingModal = true"
                    >
                      新增
                    </VButton>
                  </VSpace>
                </div>
              </div>
            </div>
          </template>
          <MenuItemListItem
            :menu-tree-items="menuTreeItems"
            @change="handleUpdateInBatch"
          />
        </VCard>
      </div>
    </div>
  </div>
</template>
