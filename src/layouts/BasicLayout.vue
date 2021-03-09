<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile()"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="false"
        :collapsible="true"
        @menuSelect="menuSelect"
      ></side-menu>
    </a-drawer>

    <side-menu
      v-else-if="isSideMenu()"
      mode="inline"
      :menus="menus"
      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
    ></side-menu>

    <a-layout
      :class="[layoutMode, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }"
    >
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '24px 24px 0', paddingTop: fixedHeader ? '64px' : '0' }">
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer>
        <global-footer />
      </a-layout-footer>
    </a-layout>

    <setting-drawer ref="drawer"></setting-drawer>

    <LoginModal @success="onLoginSucceed" />
  </a-layout>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mixin, mixinDevice } from '@/mixins/mixin'
import { asyncRouterMap } from '@/config/router.config.js'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer'
import LoginModal from '@/components/Login/LoginModal'

import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer,
    LoginModal
  },

  mixins: [mixin, mixinDevice],

  setup(mixins) {
    const store = useStore()

    const setSidebar = value => store.dispatch('setSidebar', value)
    const toggleLoginModal = value => store.dispatch('toggleLoginModal', value)

    const { isMobile, fixSidebar, sidebarOpened } = mixins

    let collapsed = ref(!sidebarOpened)
    let menus = ref([])

    menus.value = asyncRouterMap.find(item => item.path === '/').children

    const contentPaddingLeft = computed(() => {
      if (!fixSidebar || isMobile()) {
        return '0'
      }
      if (sidebarOpened) {
        return '256px'
      }
      return '80px'
    })

    const toggle = () => {
      collapsed.value = !collapsed.value
      setSidebar(!collapsed.value)
      triggerWindowResizeEvent()
    }

    const menuSelect = () => {
      if (!isDesktop()) {
        collapsed.value = false
      }
    }

    const drawerClose = () => {
      collapsed.value = false
    }

    const onLoginSucceed = () => {
      toggleLoginModal(false)
    }

    watch(sidebarOpened, value => {
      collapsed.value = !value
    })

    return {
      collapsed,
      menus,
      contentPaddingLeft,
      toggle,
      menuSelect,
      drawerClose,
      onLoginSucceed
    }
  }
})
</script>

<style lang="less">
@import url('../styles/global.less');

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
