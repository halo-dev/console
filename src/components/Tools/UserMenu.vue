<template>
  <div class="user-wrapper">
    <a :href="options.blog_url" target="_blank">
      <a-tooltip placement="bottom" title="点击跳转到首页">
        <span class="action">
          <LinkOutlined />
        </span>
      </a-tooltip>
    </a>
    <a href="javascript:void(0)" @click="handleShowLayoutSetting">
      <a-tooltip placement="bottom" title="后台布局设置">
        <span class="action">
          <SettingOutlined />
        </span>
      </a-tooltip>
    </a>
    <header-comment class="action" />
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu" v-if="user">
        <a-avatar class="avatar" size="small" :src="user.avatar || '//cn.gravatar.com/avatar/?s=256&d=mm'" />
      </span>
      <template #overlay>
        <a-menu class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'Profile' }">
              <UserOutlined />
              <span>个人资料</span>
            </router-link>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="1">
            <a href="javascript:;" @click="handleLogout">
              <LogoutOutlined />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
import HeaderComment from './HeaderComment'
import { LinkOutlined, SettingOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'

import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { Modal } from 'ant-design-vue'

export default defineComponent({
  components: {
    LinkOutlined,
    SettingOutlined,
    HeaderComment,
    UserOutlined,
    LogoutOutlined
  },

  setup() {
    const store = useStore()

    const user = computed(() => store.getters.user)
    const options = computed(() => store.getters.options)

    const logout = () => store.dispatch('logout')
    const ToggleLayoutSetting = value => store.dispatch('ToggleLayoutSetting', value)

    const handleLogout = () => {
      Modal.confirm({
        title: '提示',
        content: '确定要注销登录吗 ?',
        onOk() {
          return logout().then(() => {
            window.location.reload()
          })
        }
      })
    }

    const handleShowLayoutSetting = () => {
      ToggleLayoutSetting(true)
    }

    return {
      user,
      options,
      handleLogout,
      handleShowLayoutSetting
    }
  }
})
</script>
