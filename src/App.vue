<script lang="ts" setup>
import { RouterView } from "vue-router";
import { VMenu, VMenuItem, VMenuLabel } from "@/components/base/menu";
import { IconDashboard } from "@/core/icons";
</script>

<template>
  <div class="flex">
    <div class="navbar h-screen w-72 p-4" style="background: #fff">
      <VMenu :open-ids="['dashboard']">
        <VMenuLabel>首页</VMenuLabel>
        <VMenuItem id="dashboard">
          <template #icon>
            <Component :is="IconDashboard" />
          </template>
          <template #submenus>
            <VMenuItem>
              <template #icon>
                <Component :is="IconDashboard" />
              </template>
              子菜单
            </VMenuItem>
            <VMenuItem>
              <template #icon>
                <Component :is="IconDashboard" />
              </template>
              <template #submenus>
                <VMenuItem>
                  <template #icon>
                    <Component :is="IconDashboard" />
                  </template>
                  子菜单
                </VMenuItem>
              </template>
              子菜单
            </VMenuItem>
            <VMenuItem>
              <template #icon>
                <Component :is="IconDashboard" />
              </template>
              子菜单
            </VMenuItem>
          </template>
          仪表盘
        </VMenuItem>
        <VMenuItem>
          <template #icon>
            <Component :is="IconDashboard" />
          </template>
          仪表盘
        </VMenuItem>
        <VMenuItem>
          <template #icon>
            <Component :is="IconDashboard" />
          </template>
          <template #submenus>
            <VMenuItem>
              <template #icon>
                <Component :is="IconDashboard" />
              </template>
              子菜单1
            </VMenuItem>
            <VMenuItem>
              <template #icon>
                <Component :is="IconDashboard" />
              </template>
              子菜单1
            </VMenuItem>
            <VMenuItem>
              <template #icon>
                <Component :is="IconDashboard" />
              </template>
              子菜单1
            </VMenuItem>
          </template>
          仪表盘
        </VMenuItem>
      </VMenu>
    </div>
    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss">
body {
  background: #eff4f9;
}
</style>
