<template>
  <page-view :sub-title="theme.current.version || '-'" :title="theme.current.name || '-'" affix>
    <template slot="extra">
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleRemoteUpdate">
            <a-icon type="cloud" />
            在线更新
          </a-menu-item>
          <a-menu-item key="2" @click="localUpgradeModel.visible = true">
            <a-icon type="file" />
            本地更新
          </a-menu-item>
        </a-menu>
        <a-button icon="upload">
          更新
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item :disabled="theme.current.activated" @click="handleActiveTheme">
              <a-icon type="lock" />
              启用
            </a-menu-item>
            <a-menu-item :disabled="!theme.current.activated" @click="handleRouteToThemeVisualSetting">
              <a-icon type="eye" />
              预览模式
            </a-menu-item>
          </a-menu>
        </template>
        <a-button icon="more">
          更多
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <a-button
        :disabled="theme.current.activated"
        icon="delete"
        type="danger"
        @click="themeDeleteModal.visible = true"
      >
        删除
      </a-button>
    </template>

    <a-spin :spinning="theme.loading">
      <ThemeSettingForm :theme="theme.current" />
    </a-spin>

    <ThemeDeleteConfirmModal
      :theme="theme.current"
      :visible.sync="themeDeleteModal.visible"
      @success="onThemeDeleteSucceed"
    />

    <ThemeLocalUpgradeModal
      :theme="theme.current"
      :visible.sync="localUpgradeModel.visible"
      @success="handleGetTheme"
    />
  </page-view>
</template>
<script>
// components
import { PageView } from '@/layouts'
import ThemeDeleteConfirmModal from './components/ThemeDeleteConfirmModal'
import ThemeLocalUpgradeModal from './components/ThemeLocalUpgradeModal'
import ThemeSettingForm from './components/ThemeSettingForm'

// utils
import apiClient from '@/utils/api-client'

export default {
  name: 'ThemeSetting',
  components: {
    PageView,
    ThemeDeleteConfirmModal,
    ThemeLocalUpgradeModal,
    ThemeSettingForm
  },
  data() {
    return {
      theme: {
        current: {},
        loading: false
      },
      themeDeleteModal: {
        visible: false
      },
      localUpgradeModel: {
        visible: false
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const themeId = to.query.themeId
    next(async vm => {
      await vm.handleGetTheme(themeId)
    })
  },
  methods: {
    async handleGetTheme(themeId) {
      try {
        this.theme.loading = true
        if (themeId) {
          const { data } = await apiClient.theme.get(themeId)
          this.theme.current = data
        } else {
          const { data } = await apiClient.theme.getActivatedTheme()
          this.theme.current = data
        }
      } finally {
        this.theme.loading = false
      }
    },
    onThemeDeleteSucceed() {
      this.$router.replace({ name: 'ThemeList' })
    },
    handleRemoteUpdate() {
      const _this = this
      _this.$confirm({
        title: '提示',
        maskClosable: true,
        content: '确定更新【' + _this.theme.current.name + '】主题吗？',
        async onOk() {
          const hideLoading = _this.$message.loading('更新中...', 0)
          try {
            await apiClient.theme.updateThemeByFetching(_this.theme.current.id)
            _this.$message.success('更新成功！')
          } catch (e) {
            _this.$log.error('Failed to update theme: ', e)
          } finally {
            hideLoading()
            await _this.handleGetTheme(_this.theme.current.id)
          }
        }
      })
    },
    handleRouteToThemeVisualSetting() {
      this.$router.push({ name: 'ThemeVisualSetting', query: { themeId: this.theme.current.id } })
    },
    handleActiveTheme() {
      const _this = this
      _this.$confirm({
        title: '提示',
        maskClosable: true,
        content: '确定启用【' + _this.theme.current.name + '】主题吗？',
        async onOk() {
          try {
            await apiClient.theme.active(_this.theme.current.id)
            _this.$message.success('启用成功！')
          } catch (e) {
            _this.$log.error('Failed active theme', e)
          } finally {
            await _this.handleGetTheme(_this.theme.current.id)
          }
        }
      })
    }
  }
}
</script>
