<template>
  <div class="container-wrapper">
    <div class="halo-logo ">
      <span
        >Halo
        <small v-if="apiModel.visible">API 设置</small>
      </span>
    </div>
    <div v-show="!apiModel.visible" class="login-form">
      <LoginForm @success="onLoginSucceed" />
      <a-row>
        <a-col :span="24">
          <router-link :to="{ name: 'ResetPassword' }">
            <a class="tip" v-if="resetPasswordButtonVisible" href="javascript:void(0);">
              找回密码
            </a>
          </router-link>
          <a @click="handleToggleShowApiForm" class="tip">
            <SettingOutlined />
          </a>
        </a-col>
      </a-row>
    </div>
    <div v-show="apiModel.visible" class="api-form">
      <a-form layout="vertical" :model="apiModel">
        <a-form-item name="apiUrl">
          <a-tooltip placement="top" title="如果 Admin 不是独立部署，请不要更改此 API" trigger="click">
            <a-input placeholder="API 地址" v-model:value="apiModel.apiUrl">
              <template #prefix>
                <ApiOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
              </template>
            </a-input>
          </a-tooltip>
        </a-form-item>
        <a-form-item>
          <a-button :block="true" @click="handleRestoreApiUrl">恢复默认</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :block="true" @click="handleModifyApiUrl">保存设置</a-button>
        </a-form-item>
        <a-row>
          <a @click="handleToggleShowApiForm" class="tip">
            <RollbackOutlined />
          </a>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
import adminApi from '@/api/admin'

import { defineComponent, onBeforeMount, computed, ref, reactive } from 'vue'

import { ApiOutlined, RollbackOutlined, SettingOutlined } from '@ant-design/icons-vue'
import LoginForm from '@/components/Login/LoginForm'

import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  components: {
    LoginForm,
    ApiOutlined,
    RollbackOutlined,
    SettingOutlined
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // actions
    const refreshUserCache = () => store.dispatch('refreshUserCache')
    const refreshOptionsCache = () => store.dispatch('refreshOptionsCache')

    // getters
    const defaultApiUrl = computed(() => store.getters.apiUrl)

    // mutations
    const setApiUrl = url => store.commit('SET_API_URL', url)
    const restoreApiUrl = () => store.commit('RESTORE_API_URL')

    let resetPasswordButtonVisible = ref(false)

    const apiModel = reactive({
      apiUrl: window.location.host,
      visible: false
    })

    const handleVerifyIsInstall = async () => {
      const response = await adminApi.isInstalled()
      if (!response.data.data) {
        router.push({ name: 'Install' })
      }
    }

    const onLoginSucceed = () => {
      // Refresh the user info
      refreshUserCache()
      refreshOptionsCache()
      if (route.query.redirect) {
        router.replace(route.query.redirect)
      } else {
        router.replace({ name: 'Dashboard' })
      }
    }

    const handleModifyApiUrl = () => {
      setApiUrl(apiModel.apiUrl)
      apiModel.visible = false
    }

    const handleRestoreApiUrl = () => {
      restoreApiUrl()
      apiModel.apiUrl = defaultApiUrl
    }

    const handleToggleShowApiForm = () => {
      apiModel.visible = !apiModel.visible
      if (apiModel.visible) {
        apiModel.apiUrl = defaultApiUrl
      }
    }

    onBeforeMount(() => {
      handleVerifyIsInstall()
      document.addEventListener('keydown', function(e) {
        if (e.keyCode === 72 && e.altKey && e.shiftKey) {
          resetPasswordButtonVisible.value = !resetPasswordButtonVisible.value
        }
      })
    })

    return {
      apiModel,
      resetPasswordButtonVisible,
      onLoginSucceed,
      handleModifyApiUrl,
      handleRestoreApiUrl,
      handleToggleShowApiForm
    }
  }
})
</script>
